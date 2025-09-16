/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect, useRef } from "react";

// Карта для сопоставления валют и флагов
export const COUNTRY_CODE_MAP: Record<string, string> = {
    // A
    AED: "ae",
    AFN: "af",
    ALL: "al",
    AMD: "am",
    ANG: "sx",
    AOA: "ao",
    ARS: "ar",
    AUD: "au",
    AWG: "aw",
    AZN: "az",
    // B
    BAM: "ba",
    BBD: "bb",
    BDT: "bd",
    BGN: "bg",
    BHD: "bh",
    BIF: "bi",
    BMD: "bm",
    BND: "bn",
    BOB: "bo",
    BRL: "br",
    BSD: "bs",
    BTN: "bt",
    BWP: "bw",
    BYN: "by",
    BZD: "bz",
    // C
    CAD: "ca",
    CDF: "cd",
    CHF: "ch",
    CLP: "cl",
    CNY: "cn",
    COP: "co",
    CRC: "cr",
    CUP: "cu",
    CVE: "cv",
    CZK: "cz",
    // D
    DJF: "dj",
    DKK: "dk",
    DOP: "do",
    DZD: "dz",
    // E
    EGP: "eg",
    ERN: "er",
    ETB: "et",
    EUR: "eu",
    // F
    FJD: "fj",
    FKP: "fk",
    FOK: "fo",
    // G
    GBP: "gb",
    GEL: "ge",
    GGP: "gg",
    GHS: "gh",
    GIP: "gi",
    GMD: "gm",
    GNF: "gn",
    GTQ: "gt",
    GYD: "gy",
    // H
    HKD: "hk",
    HNL: "hn",
    HTG: "ht",
    HUF: "hu",
    // I
    IDR: "id",
    ILS: "il",
    IMP: "im",
    INR: "in",
    IQD: "iq",
    IRR: "ir",
    ISK: "is",
    // J
    JEP: "je",
    JMD: "jm",
    JOD: "jo",
    JPY: "jp",
    // K
    KES: "ke",
    KGS: "kg",
    KHR: "kh",
    KID: "ki",
    KMF: "km",
    KRW: "kr",
    KWD: "kw",
    KYD: "ky",
    KZT: "kz",
    // L
    LAK: "la",
    LBP: "lb",
    LKR: "lk",
    LRD: "lr",
    LSL: "ls",
    LYD: "ly",
    // M
    MAD: "ma",
    MDL: "md",
    MGA: "mg",
    MKD: "mk",
    MMK: "mm",
    MNT: "mn",
    MOP: "mo",
    MRU: "mr",
    MUR: "mu",
    MVR: "mv",
    MWK: "mw",
    MXN: "mx",
    MYR: "my",
    MZN: "mz",
    // N
    NAD: "na",
    NGN: "ng",
    NIO: "ni",
    NOK: "no",
    NPR: "np",
    NZD: "nz",
    // O
    OMR: "om",
    // P
    PAB: "pa",
    PEN: "pe",
    PGK: "pg",
    PHP: "ph",
    PKR: "pk",
    PLN: "pl",
    PYG: "py",
    // Q
    QAR: "qa",
    // R
    RON: "ro",
    RSD: "rs",
    RUB: "ru",
    RWF: "rw",
    // S
    SAR: "sa",
    SBD: "sb",
    SCR: "sc",
    SDG: "sd",
    SEK: "se",
    SGD: "sg",
    SHP: "sh",
    SLE: "sl",
    SOS: "so",
    SRD: "sr",
    SSP: "ss",
    STN: "st",
    SYP: "sy",
    SZL: "sz",
    // T
    THB: "th",
    TJS: "tj",
    TMT: "tm",
    TND: "tn",
    TOP: "to",
    TRY: "tr",
    TTD: "tt",
    TVD: "tv",
    TWD: "tw",
    TZS: "tz",
    // U
    UAH: "ua",
    UGX: "ug",
    USD: "us",
    UYU: "uy",
    UZS: "uz",
    // V
    VES: "ve",
    VND: "vn",
    VUV: "vu",
    // W
    WST: "ws",
    // X
    XCD: "ag",
    // Y
    YER: "ye",
    // Z
    ZAR: "za",
    ZMW: "zm",
    ZWL: "zw",
};

const GenericCurrencyIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />{" "}
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />{" "}
        <path d="M12 18V6" />
    </svg>
);

const Loader = ({ className }: { className?: string }) => (
    <div className={className} role="status">
        <svg
            aria-hidden="true"
            className="w-full h-full text-slate-500 animate-spin fill-cyan-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
);

const CurrencyIcon = ({
    code,
    className,
}: {
    code: string;
    className?: string;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Создаем ref для доступа к DOM-элементу img
    const imgRef = useRef<HTMLImageElement>(null);
    const countryCode = COUNTRY_CODE_MAP[code];

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);

        const imgElement = imgRef.current;
        // Проверяем, существует ли элемент и загружен ли он уже (из кэша)
        if (imgElement && imgElement.complete) {
            setIsLoading(false);
        }
    }, [code]);

    if (!countryCode || hasError) {
        return <GenericCurrencyIcon className={className} />;
    }

    return (
        <div className={className}>
            {isLoading && <Loader className="w-full h-full" />}
            <img
                ref={imgRef} // Привязываем ref к элементу
                src={`https://flagcdn.com/w40/${countryCode}.png`}
                alt={`${code} flag`}
                className={isLoading ? "hidden" : "block w-full h-auto"}
                onLoad={() => setIsLoading(false)} // Этот обработчик сработает для незакэшированных изображений
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
        </div>
    );
};

export default CurrencyIcon;
