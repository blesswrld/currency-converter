import RatesClient from "@/components/RatesClient";

// Эта функция теперь async, она выполняется на сервере
async function getInitialRates() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
        if (!apiKey) throw new Error("API ключ не найден.");

        const response = await fetch(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
            {
                // Кэшируем результат на 1 час, чтобы не делать лишних запросов
                next: { revalidate: 3600 },
            }
        );

        if (!response.ok) throw new Error("Не удалось загрузить курсы валют.");

        const data = await response.json();
        if (data.result === "error")
            throw new Error(`Ошибка API: ${data["error-type"]}`);

        return {
            rates: data.conversion_rates,
            allCurrencies: Object.keys(data.conversion_rates),
            error: null,
        };
    } catch (err) {
        return {
            rates: {},
            allCurrencies: [],
            error:
                err instanceof Error
                    ? err.message
                    : "Произошла неизвестная ошибка.",
        };
    }
}

// Это наш Server Component
export default async function RatesPage() {
    const { rates, allCurrencies, error } = await getInitialRates();

    // Если на сервере произошла ошибка, показываем ее
    if (error) {
        return (
            <main className="flex flex-col items-center justify-start pt-12 sm:pt-16 p-4">
                <div className="w-full max-w-4xl text-center text-red-500">
                    <p>Не удалось загрузить данные: {error}</p>
                </div>
            </main>
        );
    }

    // Передаем полученные на сервере данные в клиентский компонент
    return (
        <main className="flex flex-col items-center justify-start pt-12 sm:pt-16 p-4">
            <div className="w-full max-w-4xl">
                <RatesClient
                    initialBaseCurrency="USD"
                    initialRates={rates}
                    allCurrencies={allCurrencies}
                />
            </div>
        </main>
    );
}
