"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import HistoryChart from "@/components/HistoryChart";

// Типизация для объекта валюты
type Currency = {
    code: string;
    name: string;
    country?: string;
};

// Карта для сопоставления валют и флагов
const COUNTRY_CODE_MAP: Record<string, string> = {
    USD: "us",
    EUR: "eu",
    RUB: "ru",
    GBP: "gb",
    JPY: "jp",
    CNY: "cn",
    KZT: "kz",
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
    id,
    label,
    value,
    onChange,
    currencies,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    currencies: Currency[];
}) => {
    const countryCode = COUNTRY_CODE_MAP[value];

    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-slate-400 mb-1.5"
            >
                {label}
            </label>
            <div className="relative">
                {/* Тернарный оператор для отображения заглушки */}
                {countryCode ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={`https://flagcdn.com/w40/${countryCode}.png`}
                        alt=""
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-auto pointer-events-none"
                    />
                ) : (
                    <GenericCurrencyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none" />
                )}
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    // Добавляем отступ слева, чтобы текст не налезал на флаг
                    className="w-full bg-[#2D3748] border-transparent rounded-lg pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em] bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20fill%3d%22none%22%20viewBox%3d%220%200%2020%2020%22%3e%3cpath%20stroke%3d%22%2364748b%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22m6%208%204%204%204-4%22/%3e%3c/svg%3e')]"
                >
                    {currencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                            {curr.code} - {curr.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

// ---- ОСНОВНОЙ КОМПОНЕНТ ----
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
