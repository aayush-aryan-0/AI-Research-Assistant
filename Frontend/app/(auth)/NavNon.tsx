import ToggleThemeButton from "../components/Navbar/ToggleThemeButton"

export default function NavNon() {
    return (
        <nav className="flex flex-row justify-end items-center gap-4 px-6 py-4 mb-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <ul className="flex flex-row items-center gap-4">
                <li><ToggleThemeButton /></li>
            </ul>
        </nav>
    )
}