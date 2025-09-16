import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center justify-start pt-12 sm:pt-16 p-4">
            <div className="w-full max-w-4xl">
                <div className="bg-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">
                        О проекте
                    </h1>
                    <div className="space-y-4 text-slate-300">
                        <p>
                            Это веб-приложение &quot;Конвертер Валют&quot; было
                            создано в качестве портфолио-проекта для
                            демонстрации навыков современной веб-разработки.
                        </p>
                        <h2 className="text-xl font-semibold text-white pt-4">
                            Использованные технологии:
                        </h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                                <span className="font-semibold text-cyan-400">
                                    Next.js (App Router):
                                </span>{" "}
                                для создания быстрой и SEO-оптимизированной
                                архитектуры.
                            </li>
                            <li>
                                <span className="font-semibold text-cyan-400">
                                    React & TypeScript:
                                </span>{" "}
                                для построения интерактивного и типобезопасного
                                интерфейса.
                            </li>
                            <li>
                                <span className="font-semibold text-cyan-400">
                                    Tailwind CSS:
                                </span>{" "}
                                для быстрой и адаптивной стилизации.
                            </li>
                            <li>
                                <span className="font-semibold text-cyan-400">
                                    Radix UI:
                                </span>{" "}
                                для создания доступных и кастомизируемых
                                UI-компонентов.
                            </li>
                            <li>
                                <span className="font-semibold text-cyan-400">
                                    Recharts:
                                </span>{" "}
                                для визуализации данных в виде интерактивных
                                графиков.
                            </li>
                            <li>
                                <span className="font-semibold text-cyan-400">
                                    Sonner:
                                </span>{" "}
                                для элегантных toast-уведомлений.
                            </li>
                        </ul>
                        <p className="pt-4">
                            Данные о курсах валют предоставляются через{" "}
                            <Link
                                href="https://www.exchangerate-api.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:underline"
                            >
                                ExchangeRate-API
                            </Link>
                            .
                        </p>
                        <p className="text-center pt-6">
                            <Link
                                href="https://github.com/blesswrld/currency-converter"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-cyan-600 hover:bg-cyan-700 transition-colors text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Посмотреть код на GitHub
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
