"use client"; // Директива для использования хуков React на клиенте

import { useState, useEffect } from "react";
import { toast } from "sonner";

// Список валют для селекторов
const CURRENCIES = ["USD", "EUR", "RUB", "GBP", "JPY", "CNY", "KZT"];
// Константа для максимального значения
const MAX_ALLOWED_AMOUNT = 1_000_000_000_000_000; // 1 квадриллион

// Компонент иконки для кнопки "поменять местами"
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

export default function CurrencyConverter() {
    // Состояния компонента
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("RUB");
    const [rates, setRates] = useState<Record<string, number>>({});
    const [result, setResult] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Эффект для загрузки курсов валют при первом рендере
    useEffect(() => {
        const fetchRates = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
                if (!apiKey) {
                    throw new Error(
                        "API ключ не найден. Проверьте .env.local файл."
                    );
                }
                const response = await fetch(
                    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
                );

                if (!response.ok) {
                    throw new Error(
                        "Сетевая ошибка при получении данных о курсах."
                    );
                }
                const data = await response.json();
                if (data.result === "error") {
                    throw new Error(`Ошибка API: ${data["error-type"]}`);
                }
                setRates(data.conversion_rates);
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

        fetchRates();
    }, []); // Пустой массив зависимостей гарантирует вызов только один раз

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

        // Обновляем состояние только если значение в допустимых пределах
        if (numericValue >= 0) {
            setAmount(numericValue);
        }
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
                    <div>
                        <label
                            htmlFor="from"
                            className="block text-sm font-medium text-slate-400 mb-1.5"
                        >
                            Из
                        </label>
                        <select
                            id="from"
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className="w-full bg-[#2D3748] border-transparent rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em] bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20fill%3d%22none%22%20viewBox%3d%220%200%2020%2020%22%3e%3cpath%20stroke%3d%22%2364748b%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22m6%208%204%204%204-4%22/%3e%3c/svg%3e')]"
                        >
                            {CURRENCIES.map((curr) => (
                                <option key={curr} value={curr}>
                                    {curr}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleSwap}
                        title="Поменять валюты местами"
                        className="p-3 bg-[#2D3748] rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <SwapIcon />
                    </button>
                </div>

                <div>
                    <label
                        htmlFor="to"
                        className="block text-sm font-medium text-slate-400 mb-1.5"
                    >
                        В
                    </label>
                    <select
                        id="to"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full bg-[#2D3748] border-transparent rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em] bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20fill%3d%22none%22%20viewBox%3d%220%200%2020%2020%22%3e%3cpath%20stroke%3d%22%2364748b%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22m6%208%204%204%204-4%22/%3e%3c/svg%3e')]"
                    >
                        {CURRENCIES.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="text-center pt-2 min-h-[76px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full animate-pulse text-slate-400">
                        Загрузка курсов...
                    </div>
                ) : result !== null ? (
                    <div className="flex flex-col justify-center h-full">
                        <p className="text-base text-slate-400 break-words">
                            {amount.toLocaleString("ru-RU")} {fromCurrency} =
                        </p>
                        <p className="text-4xl font-bold text-cyan-400 break-words">
                            {result.toLocaleString("ru-RU", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{" "}
                            {toCurrency}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
