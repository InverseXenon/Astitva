import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-purple-700">
          Astitva
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8 text-purple-700 font-medium">
          <Link to="/" className="hover:text-purple-500 transition">Home</Link>
          <Link to="/jobfindings" className="hover:text-purple-500 transition">Jobs</Link>
          <Link to="/health-wellness" className="hover:text-purple-500 transition">Health</Link>
          <Link to="/resources" className="hover:text-purple-500 transition">Resource Finder</Link>
          <Link to="/community" className="hover:text-purple-500 transition">Community</Link>

          {/* Dropdown for More Services */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 hover:text-purple-500 transition"
            >
              <span>More</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <Link to="/education-hub" className="block px-4 py-2 hover:bg-purple-100">Education Hub</Link>
                <Link to="/financial-freedom" className="block px-4 py-2 hover:bg-purple-100">Financial Freedom</Link>
                <Link to="/legal-support" className="block px-4 py-2 hover:bg-purple-100">Legal Support</Link>
              </div>
            )}
          </div>
        </div>

        {/* Authentication & User Button */}
        <div className="hidden lg:flex space-x-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                Login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-100 transition">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6 text-purple-700" /> : <Menu className="w-6 h-6 text-purple-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4">
          <Link to="/" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobfindings" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Jobs</Link>
          <Link to="/health" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Health</Link>
          <Link to="/resource-finder" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Resource Finder</Link>
          <Link to="/community-support" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Community</Link>
          <Link to="/education" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Education Hub</Link>
          <Link to="/financial-freedom" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Financial Freedom</Link>
          <Link to="/legal-support" className="block px-6 py-2 text-purple-700" onClick={() => setMenuOpen(false)}>Legal Support</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
