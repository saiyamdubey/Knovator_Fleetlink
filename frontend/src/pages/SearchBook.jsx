// src/pages/SearchBookPage.jsx
import { useState } from "react";
import axios from "axios";
import VehicleCard from "../components/VehicleCard";

function isValidLocalDateTime(value) {
    if (!value) return false;
    // datetime-local format: YYYY-MM-DDTHH:MM (no timezone)
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!regex.test(value)) return false;
    const d = new Date(value);
    return !Number.isNaN(d.getTime());
}

export default function SearchBookPage() {
    const [form, setForm] = useState({
        capacityRequired: "",
        fromPincode: "",
        toPincode: "",
        startTime: "",
    });
    const [vehicles, setVehicles] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const normalizeStartTime = (raw) => {
        // Preferred: datetime-local -> ISO in local timezone
        if (isValidLocalDateTime(raw)) {
            return new Date(raw).toISOString();
        }
        // Try fallback: if user pasted an ISO already or some other parseable string
        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
        // invalid
        return null;
    };

    const handleSearch = async () => {
        // basic client validation
        if (
            !form.capacityRequired ||
            !form.fromPincode ||
            !form.toPincode ||
            !form.startTime
        ) {
            setMessage("Please fill in all fields.");
            setVehicles([]);
            return;
        }

        const startISO = normalizeStartTime(form.startTime);
        if (!startISO) {
            setMessage(
                "Invalid date/time. Use the date-time picker or format YYYY-MM-DDTHH:MM."
            );
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const params = {
                capacityRequired: Number(form.capacityRequired),
                fromPincode: form.fromPincode,
                toPincode: form.toPincode,
                startTime: startISO,
            };

            // GET /api/vehicles/available returns { estimatedRideDurationHours, vehicles }
            const res = await axios.get("http://localhost:5000/api/vehicles/available", { params });
            // if backend returns object: { estimatedRideDurationHours, vehicles }
            if (res.data && res.data.vehicles) {
                setVehicles(res.data.vehicles);
            } else {
                setVehicles(res.data || []);
            }
            setMessage((res.data && res.data.vehicles && res.data.vehicles.length === 0) ? "No vehicles available." : "");
        } catch (err) {
            console.error("Search error:", err);
            const text = err?.response?.data?.error || err?.response?.data?.message || "Error fetching vehicles.";
            setMessage(text);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (vehicleId) => {
        const startISO = normalizeStartTime(form.startTime);
        if (!startISO) {
            setMessage("Invalid date/time. Cannot book.");
            return;
        }

        try {
            const payload = {
                vehicleId,
                fromPincode: form.fromPincode,
                toPincode: form.toPincode,
                startTime: startISO,
                customerId: "customer123",
            };
            await axios.post("http://localhost:5000/api/bookings", payload);
            setMessage("✅ Booking successful!");
            handleSearch();
        } catch (err) {
            console.error("Booking error:", err);
            const text = err?.response?.data?.message || "Booking failed. Vehicle may be unavailable.";
            setMessage(text);
        }
    };

    // helper: set minimum for datetime-local (prevent selecting too-old dates)
    const nowLocal = new Date();
    // produce "YYYY-MM-DDTHH:MM" for input min
    const tzOffset = -nowLocal.getTimezoneOffset();
    const localISO = new Date(nowLocal.getTime() + tzOffset * 60000).toISOString().slice(0, 16);

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Search & Book Vehicles</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input type="number" name="capacityRequired" placeholder="Capacity (Kg)" value={form.capacityRequired} onChange={handleChange} className="p-3 border rounded shadow focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="fromPincode" placeholder="From Pincode" value={form.fromPincode} onChange={handleChange} className="p-3 border rounded shadow focus:ring-2 focus:ring-blue-500" />
                <input type="text" name="toPincode" placeholder="To Pincode" value={form.toPincode} onChange={handleChange} className="p-3 border rounded shadow focus:ring-2 focus:ring-blue-500" />
                <input type="date" name="startTime" value={form.startTime} onChange={handleChange} min={localISO} className="p-3 border rounded shadow focus:ring-2 focus:ring-blue-500" />
            </div>

            <button onClick={handleSearch} disabled={loading} className="bg-blue-600 text-white py-3 px-6 rounded shadow hover:bg-blue-700 w-full md:w-auto">
                {loading ? "Searching..." : "Search Availability"}
            </button>

            {message && <p className="mt-4 text-center text-red-600">{message}</p>}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map((v) => (
                    <VehicleCard key={v._id} vehicle={v} onBook={handleBook} />
                ))}
            </div>
        </div>
    );
}
