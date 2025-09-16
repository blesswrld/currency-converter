"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Определяем ссылки для навигации
const navLinks = [
    { href: "/", label: "Конвертер" },
    { href: "/rates", label: "Курсы валют" },
    { href: "/crypto", label: "Криптовалюты" },
    { href: "/about", label: "О проекте" },
];

export default function Header() {
    const pathname = usePathname(); // Хук для определения текущего пути

    return (
        <header className="w-full bg-[#1E293B] p-4 shadow-lg sticky top-0 z-10">
            <nav className="max-w-4xl mx-auto flex items-center justify-center gap-4 sm:gap-8">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            // Динамически меняем стили для активной ссылки
                            className={`text-sm sm:text-base font-medium transition-colors hover:text-cyan-400 ${
                                isActive ? "text-cyan-400" : "text-slate-400"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}
