import CurrencyConverter from "@/components/CurrencyConverter";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start pt-12 sm:pt-16 p-4 text-white">
            <div className="w-full max-w-2xl">
                <CurrencyConverter />
            </div>
        </main>
    );
}
