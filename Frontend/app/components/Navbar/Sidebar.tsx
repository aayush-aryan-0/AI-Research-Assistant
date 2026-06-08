"use client"
import { useState } from "react"

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Hamburger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col justify-center gap-1.5 w-9 h-9 p-2 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 cursor-pointer"
                aria-label="Toggle sidebar"
            >
                <span className="block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-200" />
                <span className="block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-200" />
                <span className="block h-0.5 w-full bg-gray-700 dark:bg-gray-300 transition-all duration-200" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 transition-opacity duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl transition-transform duration-200
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-4 overflow-y-auto overflow-x-hidden h-full">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Sidebar content
                    </span>
                </div>
            </aside>
        </>
    )
}