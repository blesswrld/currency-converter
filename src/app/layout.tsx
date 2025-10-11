import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Конвертер Валют | Онлайн калькулятор курсов",
    description:
        "Быстрый и удобный онлайн-конвертер валют. Переводите доллары, евро, рубли и другие мировые валюты в реальном времени по актуальному курсу.",
    keywords:
        "конвертер валют, курс валют, обмен валют, калькулятор валют, онлайн, USD, EUR, RUB",
    authors: [{ name: "Tamerlan (blesswrld)" }],

    manifest: "/favicon/manifest.json",

    icons: {
        icon: [
            { url: "/favicon/favicon.ico", sizes: "any" },
            {
                url: "/favicon/favicon-16x16.png",
                type: "image/png",
                sizes: "16x16",
            },
            {
                url: "/favicon/favicon-32x32.png",
                type: "image/png",
                sizes: "32x32",
            },
        ],
        apple: [
            { url: "/favicon/apple-icon-57x57.png", sizes: "57x57" },
            { url: "/favicon/apple-icon-60x60.png", sizes: "60x60" },
            { url: "/favicon/apple-icon-72x72.png", sizes: "72x72" },
            { url: "/favicon/apple-icon-76x76.png", sizes: "76x76" },
            { url: "/favicon/apple-icon-114x114.png", sizes: "114x114" },
            { url: "/favicon/apple-icon-120x120.png", sizes: "120x120" },
            { url: "/favicon/apple-icon-144x144.png", sizes: "144x144" },
            { url: "/favicon/apple-icon-152x152.png", sizes: "152x152" },
            { url: "/favicon/apple-icon-180x180.png", sizes: "180x180" },
        ],
        other: [
            {
                rel: "android-chrome-192x192",
                url: "/favicon/android-icon-192x192.png",
                sizes: "192x192",
            },
        ],
    },
};

export const viewport: Viewport = {
    themeColor: "#0F172A",
    width: "device-width",
    initialScale: 1,
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
