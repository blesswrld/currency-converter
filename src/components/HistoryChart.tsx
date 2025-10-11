"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { format, subDays } from "date-fns";

type ChartData = {
    date: string;
    rate: number;
};

interface HistoryChartProps {
    fromCurrency: string;
    toCurrency: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#2D3748] p-2 rounded-md border border-slate-600">
                <p className="label text-sm text-slate-400">{`Дата: ${label}`}</p>
                <p className="intro text-sm text-white">{`Курс: ${payload[0].value.toFixed(
                    4
                )}`}</p>
            </div>
        );
    }
    return null;
};

export default function HistoryChart({
    fromCurrency,
    toCurrency,
}: HistoryChartProps) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);

            const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

            try {
                const response = await fetch(url);
                if (!response.ok)
                    throw new Error(
                        "Не удалось загрузить исторические данные."
                    );

                const data = await response.json();
                const rate = data.rates[toCurrency];

                const historyData: ChartData[] = [];
                for (let i = 29; i >= 0; i--) {
                    const date = subDays(new Date(), i);
                    const simulatedRate =
                        rate * (1 + (Math.random() - 0.5) * 0.02);
                    historyData.push({
                        date: format(date, "MMM d"),
                        rate: simulatedRate,
                    });
                }
                setChartData(historyData);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Ошибка загрузки графика"
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (fromCurrency && toCurrency) {
            fetchHistory();
        }
    }, [fromCurrency, toCurrency]);

    if (isLoading) {
        return (
            <div className="h-48 flex items-center justify-center text-slate-400 animate-pulse">
                Загрузка графика...
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-48 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="date"
                        stroke="#94A3B8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94A3B8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(value) => value.toFixed(2)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#22D3EE"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
