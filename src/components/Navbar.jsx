export default function Navbar() {
    return (
        <>
            <div className="navbar bg-white shadow-sm px-6">
                {/* Navbar Start (Logo and Mobile Menu) */}
                <div className="navbar-start">
                    {/* Mobile Dropdown Menu */}
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            ☰
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow"
                        >
                            <li><a className="text-purple-700 hover:text-purple-500">Home</a></li>
                            <li><a className="text-purple-700 hover:text-purple-500">About</a></li>
                            <li><a className="text-purple-700 hover:text-purple-500">Services</a></li>
                            <li><a className="text-purple-700 hover:text-purple-500">Contact</a></li>
                            <li><a className="text-purple-700 hover:text-purple-500">Support</a></li>
                        </ul>
                    </div>
                    {/* Logo */}
                    <a className="text-xl font-bold text-purple-700">Your Logo</a>
                </div>

                {/* Navbar Center (Desktop Menu) */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><a className="text-purple-700 hover:text-purple-500">Home</a></li>
                        <li><a className="text-purple-700 hover:text-purple-500">About</a></li>
                        <li><a className="text-purple-700 hover:text-purple-500">Services</a></li>
                        <li><a className="text-purple-700 hover:text-purple-500">Contact</a></li>
                        <li><a className="text-purple-700 hover:text-purple-500">Support</a></li>
                    </ul>
                </div>

                {/* Navbar End (Button) */}
                <div className="navbar-end">
                    <a className="btn border border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white">
                        Login
                    </a>
                </div>
            </div>
        </>
    );
}
