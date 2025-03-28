import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Body() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <Navbar />
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 pt-16 pb-16 overflow-y-auto"> {/* pt-16 = padding for header height */}
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 w-full bg-white border-t z-50">
        <Footer />
      </footer>
    </div>
  );
}