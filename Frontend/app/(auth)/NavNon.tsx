import ToggleThemeButton from "../components/Navbar/ToggleThemeButton"

export default function NavNon() {
    return (
        <nav className="flex flex-row justify-end gap-4 p-4 mb-10 ">
            <ul className="flex flex-row items-center gap-4">
                <li><ToggleThemeButton /></li>
            </ul>
        </nav>
    )
}