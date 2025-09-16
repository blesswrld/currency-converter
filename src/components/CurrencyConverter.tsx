"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import HistoryChart from "@/components/HistoryChart";
// Импорты для кастомного Select
import * as Select from "@radix-ui/react-select";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";

// Типизация для объекта валюты
type Currency = {
    code: string;
    name: string;
    country?: string;
};

// Карта для сопоставления валют и флагов
const COUNTRY_CODE_MAP: Record<string, string> = {
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

const MAX_ALLOWED_AMOUNT = 1_000_000_000_000_000;

const SwapIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
    >
        <path
            d="M7.5 21L3 16.5M3 16.5L7.5 12M3 16.5H16.5M16.5 3L21 7.5M21 7.5L16.5 12M21 7.5H7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// Компонент-заглушка для валют без флага
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
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
    </svg>
);

// Компонент для выбора валюты с флагом
const CurrencySelect = ({
    label,
    value,
    onChange,
    currencies,
}: {
    id: string; // id больше не нужен для select, но оставляем в props для совместимости
    label: string;
    value: string;
    onChange: (v: string) => void;
    currencies: Currency[];
}) => {
    const selectedCurrency = currencies.find((c) => c.code === value);
    const countryCode = COUNTRY_CODE_MAP[value];

    return (
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
                {label}
            </label>
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger className="w-full bg-[#2D3748] border-transparent rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none flex items-center justify-between text-white text-left">
                    <Select.Value asChild>
                        <div className="flex items-center gap-3 overflow-hidden">
                            {countryCode ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={`https://flagcdn.com/w40/${countryCode}.png`}
                                    alt=""
                                    className="w-6 h-auto flex-shrink-0"
                                />
                            ) : (
                                <GenericCurrencyIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate">
                                {selectedCurrency
                                    ? `${selectedCurrency.code} - ${selectedCurrency.name}`
                                    : "Выбрать..."}
                            </span>
                        </div>
                    </Select.Value>
                    <Select.Icon className="text-slate-400">
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content
                        position="popper"
                        sideOffset={5}
                        className="bg-[#1E293B] rounded-lg shadow-lg z-50 overflow-hidden w-[var(--radix-select-trigger-width)]"
                    >
                        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] cursor-default text-white">
                            <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-2 max-h-[256px]">
                            {currencies.map((curr) => {
                                const flagCode = COUNTRY_CODE_MAP[curr.code];
                                return (
                                    <Select.Item
                                        key={curr.code}
                                        value={curr.code}
                                        className="flex items-center gap-3 p-2 rounded-md text-sm text-white relative select-none data-[highlighted]:bg-cyan-600 data-[highlighted]:outline-none cursor-pointer"
                                    >
                                        {flagCode ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`https://flagcdn.com/w40/${flagCode}.png`}
                                                alt=""
                                                className="w-6 h-auto"
                                            />
                                        ) : (
                                            <GenericCurrencyIcon className="w-6 h-6 text-slate-400" />
                                        )}
                                        <Select.ItemText>
                                            {curr.code} - {curr.name}
                                        </Select.ItemText>
                                        <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                                            <CheckIcon />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                );
                            })}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] cursor-default text-white">
                            <ChevronDownIcon />
                        </Select.ScrollDownButton>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
};

// ---- ОСНОВНОЙ КОМПОНЕНТ (ЛОГИКА И КОММЕНТАРИИ НЕ ТРОНУТЫ) ----
export default function CurrencyConverter() {
    const [amount, setAmount] = useState(1);

    // --- Инициализируем состояние безопасными значениями по умолчанию ---
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("RUB");

    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [rates, setRates] = useState<Record<string, number>>({});
    const [result, setResult] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Этот useEffect сохраняет в localStorage ---
    useEffect(() => {
        // Проверяем, что мы на клиенте
        if (typeof window !== "undefined") {
            localStorage.setItem("fromCurrency", fromCurrency);
            localStorage.setItem("toCurrency", toCurrency);
        }
    }, [fromCurrency, toCurrency]);

    // --- Этот useEffect читает из localStorage и загружает данные ---
    useEffect(() => {
        // Сначала восстанавливаем значения из localStorage
        const savedFrom = localStorage.getItem("fromCurrency");
        const savedTo = localStorage.getItem("toCurrency");
        if (savedFrom) setFromCurrency(savedFrom);
        if (savedTo) setToCurrency(savedTo);

        // Затем загружаем данные API
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
                if (!apiKey) throw new Error("API ключ не найден.");

                const [codesRes, ratesRes] = await Promise.all([
                    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`),
                    fetch(
                        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
                    ),
                ]);

                if (!codesRes.ok || !ratesRes.ok)
                    throw new Error("Сетевая ошибка.");

                const codesData = await codesRes.json();
                const ratesData = await ratesRes.json();

                if (
                    codesData.result === "error" ||
                    ratesData.result === "error"
                )
                    throw new Error("Ошибка API.");

                const currencyList = codesData.supported_codes.map(
                    ([code, name]: [string, string]) => ({ code, name })
                );
                setCurrencies(currencyList);
                setRates(ratesData.conversion_rates);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Произошла неизвестная ошибка."
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        // Пустой массив зависимостей, чтобы этот эффект выполнился один раз при монтировании
    }, []);

    // Эффект для пересчета результата при изменении входных данных
    useEffect(() => {
        if (Object.keys(rates).length === 0) return;

        const rateFrom = rates[fromCurrency];
        const rateTo = rates[toCurrency];

        if (rateFrom && rateTo) {
            // Базовая валюта в API - USD. Конвертируем через нее.
            const valueInUsd = amount / rateFrom;
            setResult(valueInUsd * rateTo);
        }
    }, [amount, fromCurrency, toCurrency, rates]);

    // Функция для обмена валют местами
    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    // Функция-обработчик для контроля ввода суммы
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Позволяем очищать поле, приравнивая к 0
        if (value === "") {
            setAmount(0);
            return;
        }
        const numericValue = Number(value);

        // Если значение превышает лимит, показываем тостер и выходим
        if (numericValue > MAX_ALLOWED_AMOUNT) {
            toast.error("Превышено максимально допустимое значение.");
            return;
        }
        if (numericValue >= 0) setAmount(numericValue);
    };

    return (
        <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
            <h1 className="text-2xl font-bold text-center text-white">
                Конвертер валют
            </h1>

            {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_auto] gap-3 items-end">
                    <div>
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-slate-400 mb-1.5"
                        >
                            Сумма
                        </label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            // Используем функцию и добавляем min атрибут
                            onChange={handleAmountChange}
                            min="0"
                            className="w-full bg-[#2D3748] border-transparent rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                    </div>
                    <CurrencySelect
                        id="from"
                        label="Из"
                        value={fromCurrency}
                        onChange={setFromCurrency}
                        currencies={currencies}
                    />

                    <button
                        onClick={handleSwap}
                        title="Поменять валюты местами"
                        className="p-3 bg-[#2D3748] rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <SwapIcon />
                    </button>
                </div>

                <CurrencySelect
                    id="to"
                    label="В"
                    value={toCurrency}
                    onChange={setToCurrency}
                    currencies={currencies}
                />
            </div>

            <div className="text-center pt-2 min-h-[100px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full animate-pulse text-slate-400">
                        Загрузка данных...
                    </div>
                ) : (
                    result !== null && (
                        // key={result} заставляет анимацию проигрываться при каждом изменении результата
                        <motion.div
                            key={result}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-base text-slate-400 break-words">
                                {amount.toLocaleString("ru-RU")} {fromCurrency}{" "}
                                =
                            </p>
                            <p className="text-4xl font-bold text-cyan-400 break-words">
                                {result.toLocaleString("ru-RU", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 4,
                                })}{" "}
                                {toCurrency}
                            </p>
                            {/* --- Обратный курс --- */}
                            {amount > 0 && result > 0 && (
                                <p className="text-sm text-slate-500 mt-1">
                                    1 {toCurrency} ={" "}
                                    {(amount / result).toFixed(4)}{" "}
                                    {fromCurrency}
                                </p>
                            )}
                        </motion.div>
                    )
                )}
            </div>

            {/* --- График истории --- */}
            {!isLoading && (
                <HistoryChart
                    fromCurrency={fromCurrency}
                    toCurrency={toCurrency}
                />
            )}
        </div>
    );
}
