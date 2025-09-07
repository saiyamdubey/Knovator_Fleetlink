import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SearchBookPage from "./pages/SearchBook";
import AddVehiclePage from "./pages/AddVehicle";
import { Car } from "lucide-react";
import { motion } from "framer-motion";

function App() {
  return (
    <Router>
      <nav className="bg-blue-900 text-white p-4 flex items-center relative overflow-hidden">
        {/* Logo */}
        <h1 className="text-xl font-bold mr-6">FleetLink</h1>

        {/* Car track (full width between logo and links) */}
        <div className="flex-1 relative w-full h-11 overflow-hidden">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            animate={{ x: ["-10%", "2800%"] }}
            transition={{

              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Car className="text-yellow-300 w-11 h-11" />
          </motion.div>
        </div>

        {/* Links */}
        <div className="space-x-4 ml-6">
          <Link to="/" className="hover:text-blue-400">Search</Link>
          <Link to="/add-vehicle" className="hover:text-blue-400">Add Vehicle</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<SearchBookPage />} />
        <Route path="/add-vehicle" element={<AddVehiclePage />} />
      </Routes>
    </Router>
  );
}

export default App;
