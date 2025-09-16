"use client";

import { useState, useEffect } from "react";
import CurrencyIcon from "@/components/CurrencyIcon";

// Типизация для объекта с курсами
type Rates = Record<string, number>;

// Компонент для отображения одной строки таблицы
const RateRow = ({ code, rate }: { code: string; rate: number }) => (
    <tr className="border-b border-slate-700 hover:bg-slate-800">
        <td className="p-4 flex items-center gap-3">
            <CurrencyIcon code={code} className="w-8 h-8 flex-shrink-0" />
            <span className="font-medium text-white">{code}</span>
        </td>
        <td className="p-4 text-right font-mono text-white">
            {rate.toFixed(4)}
        </td>
    </tr>
);

interface RatesClientProps {
    initialBaseCurrency: string;
    initialRates: Rates;
    allCurrencies: string[];
}

// Это наш клиентский компонент, который принимает начальные данные как props
export default function RatesClient({
    initialBaseCurrency,
    initialRates,
    allCurrencies: initialAllCurrencies,
}: RatesClientProps) {
    const [baseCurrency, setBaseCurrency] = useState(initialBaseCurrency);
    const [rates, setRates] = useState<Rates>(initialRates);
    const [allCurrencies] = useState<string[]>(initialAllCurrencies);
    const [isLoading, setIsLoading] = useState(false); // Начальное состояние - не загрузка
    const [error, setError] = useState<string | null>(null);

    // Этот useEffect теперь срабатывает только при смене базовой валюты
    useEffect(() => {
        // Пропускаем первый рендер, так как данные уже есть
        if (baseCurrency === initialBaseCurrency) {
            return;
        }

        const fetchRates = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
                if (!apiKey) throw new Error("API ключ не найден.");

                const response = await fetch(
                    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
                );
                if (!response.ok)
                    throw new Error("Не удалось обновить курсы валют.");

                const data = await response.json();
                if (data.result === "error")
                    throw new Error(`Ошибка API: ${data["error-type"]}`);
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
    }, [baseCurrency, initialBaseCurrency]);

    return (
        <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">Курсы валют</h1>
                <div className="flex items-center gap-3">
                    <label htmlFor="base-currency" className="text-slate-400">
                        Базовая валюта:
                    </label>
                    <select
                        id="base-currency"
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value)}
                        className="bg-[#2D3748] text-white border-transparent rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    >
                        {allCurrencies.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="text-center text-red-500 py-8">{error}</div>
            )}

            <div className="overflow-x-auto relative">
                {/* Показываем оверлей загрузки поверх старых данных */}
                {isLoading && (
                    <div className="absolute inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center z-10 rounded-b-2xl">
                        <div className="text-slate-400">Обновление...</div>
                    </div>
                )}
                <table className="w-full min-w-[400px]">
                    <thead>
                        <tr className="border-b border-slate-600">
                            <th className="p-4 text-left text-slate-400 font-semibold">
                                Валюта
                            </th>
                            <th className="p-4 text-right text-slate-400 font-semibold">
                                Курс к {baseCurrency}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(rates).map(([code, rate]) => (
                            <RateRow key={code} code={code} rate={rate} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
