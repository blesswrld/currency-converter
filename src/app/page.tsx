import CurrencyConverter from "@/components/CurrencyConverter";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] p-4 text-white">
            <div className="w-full md:w-1/2 max-w-2xl">
                <CurrencyConverter />
            </div>
        </main>
    );
}
