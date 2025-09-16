"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import HistoryChart from "@/components/HistoryChart";
import CurrencySelect from "./CurrencySelect"; // Импортируем кастомный селект

// Определяем тип Currency
type Currency = {
    code: string;
    name: string;
};

const MAX_ALLOWED_AMOUNT = 1_000_000_000_000_000;

const SwapIcon = () => (
    <svg
        width="20"
        height="20"
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

    const isInitialMount = useRef(true);

    // Этот useEffect теперь будет сохранять в localStorage, пропуская первый рендер
    useEffect(() => {
        // Если это первый рендер, мы просто меняем флаг и выходим.
        // Это предотвращает перезапись localStorage значениями по умолчанию.
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // На всех последующих рендерах (после изменений) мы сохраняем данные.
            if (typeof window !== "undefined") {
                localStorage.setItem("fromCurrency", fromCurrency);
                localStorage.setItem("toCurrency", toCurrency);
            }
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

    // --- Обработчик фокуса ---
    const handleAmountFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
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
                            // Добавляем обработчик onFocus
                            onFocus={handleAmountFocus}
                            min="0"
                            className="w-full bg-[#2D3748] border-transparent rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                        />
                    </div>
                    {/* Передаем id, который теперь будет использоваться для связывания */}
                    <CurrencySelect
                        id="from-currency"
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
                    id="to-currency"
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
