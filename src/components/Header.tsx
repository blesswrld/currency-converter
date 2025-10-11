"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";

const navLinks = [
    { href: "/", label: "Конвертер" },
    { href: "/rates", label: "Курсы валют" },
    { href: "/crypto", label: "Криптовалюты" },
    { href: "/about", label: "О проекте" },
];

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    return (
        <header className="w-full bg-[#1E293B] p-6 shadow-lg z-50 relative">
            <nav className="max-w-4xl mx-auto flex items-center justify-center md:justify-center">
                <div className="hidden md:flex items-center justify-center gap-4 sm:gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm sm:text-base font-medium transition-colors hover:text-cyan-400 ${
                                    isActive
                                        ? "text-cyan-400"
                                        : "text-slate-400"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="md:hidden flex-1 flex justify-end">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-md text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label="Открыть меню"
                    >
                        <HamburgerMenuIcon className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-[#0F172A] flex flex-col p-4 z-50"
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-md text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            aria-label="Закрыть меню"
                        >
                            <Cross1Icon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`w-full text-center py-4 text-2xl font-semibold rounded-lg transition-colors hover:bg-slate-800 ${
                                        isActive
                                            ? "text-cyan-400 bg-slate-800"
                                            : "text-slate-300"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
