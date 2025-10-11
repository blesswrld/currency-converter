"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type CryptoCoin = {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
};

const formatMarketCap = (cap: number): string => {
    if (cap > 1_000_000_000_000) {
        return `${(cap / 1_000_000_000_000).toFixed(2)} трлн`;
    }
    if (cap > 1_000_000_000) {
        return `${(cap / 1_000_000_000).toFixed(2)} млрд`;
    }
    if (cap > 1_000_000) {
        return `${(cap / 1_000_000).toFixed(2)} млн`;
    }
    return cap.toString();
};

export default function CryptoPage() {
    const [cryptoData, setCryptoData] = useState<CryptoCoin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCryptoData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false"
                );
                if (!response.ok)
                    throw new Error(
                        "Не удалось загрузить данные о криптовалютах."
                    );
                const data = await response.json();
                setCryptoData(data);
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
        fetchCryptoData();
    }, []);

    return (
        <main className="flex flex-col items-center justify-start pt-12 sm:pt-16 p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">
                        Курсы криптовалют
                    </h1>

                    {isLoading && (
                        <div className="text-center text-slate-400 py-8">
                            Загрузка данных...
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-500 py-8">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-slate-600">
                                        <th className="p-4 text-left text-slate-400 font-semibold">
                                            #
                                        </th>
                                        <th className="p-4 text-left text-slate-400 font-semibold">
                                            Название
                                        </th>
                                        <th className="p-4 text-right text-slate-400 font-semibold">
                                            Цена
                                        </th>
                                        <th className="p-4 text-right text-slate-400 font-semibold">
                                            24ч %
                                        </th>
                                        <th className="p-4 text-right text-slate-400 font-semibold">
                                            Рын. кап.
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cryptoData.map((coin, index) => {
                                        const isPositive =
                                            coin.price_change_percentage_24h >=
                                            0;
                                        return (
                                            <tr
                                                key={coin.id}
                                                className="border-b border-slate-700 hover:bg-slate-800"
                                            >
                                                <td className="p-4 text-slate-400">
                                                    {index + 1}
                                                </td>
                                                <td className="p-4 flex items-center gap-3">
                                                    <Image
                                                        src={coin.image}
                                                        alt={coin.name}
                                                        width={32}
                                                        height={32}
                                                        className="w-8 h-8"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-white">
                                                            {coin.name}
                                                        </div>
                                                        <div className="text-sm text-slate-400">
                                                            {coin.symbol.toUpperCase()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right font-mono text-white">
                                                    $
                                                    {coin.current_price.toLocaleString(
                                                        "en-US",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 6,
                                                        }
                                                    )}
                                                </td>
                                                <td
                                                    className={`p-4 text-right font-mono font-medium ${
                                                        isPositive
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {isPositive && "+"}
                                                    {coin.price_change_percentage_24h.toFixed(
                                                        2
                                                    )}
                                                    %
                                                </td>
                                                <td className="p-4 text-right font-mono text-white">
                                                    $
                                                    {formatMarketCap(
                                                        coin.market_cap
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
