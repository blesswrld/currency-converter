import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import "./globals.css";

// Инициализируем шрифт Inter с нужными настройками
const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: "swap",
    variable: "--font-inter",
});

// Определяем метаданные для всего приложения
export const metadata: Metadata = {
    title: "Конвертер Валют | Онлайн калькулятор курсов",
    description:
        "Быстрый и удобный онлайн-конвертер валют. Переводите доллары, евро, рубли и другие мировые валюты в реальном времени по актуальному курсу.",
    keywords:
        "конвертер валют, курс валют, обмен валют, калькулятор валют, онлайн, USD, EUR, RUB",
    authors: [{ name: "Tamerlan (blesswrld)" }],
    // Иконки для вкладки браузера и PWA
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    // Цвет адресной строки в мобильных браузерах
    // themeColor: "#0F172A",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={`${inter.className} antialiased`}>
                <Header />
                {children}
                <Toaster richColors position="top-center" theme="dark" />
            </body>
        </html>
    );
}
