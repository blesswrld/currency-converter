export default function CryptoPage() {
    return (
        <main className="flex flex-col items-center justify-start pt-12 sm:pt-16 p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-2xl text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Курсы криптовалют
                    </h1>
                    <p className="text-slate-400">
                        Здесь будет отображаться список популярных криптовалют с
                        их текущими ценами.
                    </p>
                    <div className="mt-8 p-8 border-2 border-dashed border-slate-600 rounded-lg">
                        <p className="text-slate-500">
                            Компонент для отслеживания крипто-курсов скоро
                            появится здесь.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
