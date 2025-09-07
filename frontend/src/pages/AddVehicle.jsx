import { useState } from "react";
import axios from "axios";

export default function AddVehiclePage() {
    const [form, setForm] = useState({ name: "", capacityKg: "", tyres: "" });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                name: form.name,
                capacityKg: Number(form.capacityKg),
                tyres: Number(form.tyres),
            };

            const res = await axios.post("http://localhost:5000/api/vehicles", payload);
            setMessage(`✅ Vehicle "${res.data.name}" added successfully!`);
            setForm({ name: "", capacityKg: "", tyres: "" });
        } catch (err) {
            console.error(err.response?.data || err);
            setMessage("❌ Error adding vehicle.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-lg mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Add Vehicle</h1>
                    <p className="text-slate-600 text-lg">Register your vehicle with our fleet management system</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                        <h2 className="text-white text-xl font-semibold flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Vehicle Information
                        </h2>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Vehicle Name Field */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Vehicle Name
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                    </svg>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter vehicle name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 text-slate-700 placeholder-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Capacity Field */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Load Capacity (Kg)
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l3-3 3 3" />
                                    </svg>
                                    <input
                                        type="number"
                                        name="capacityKg"
                                        placeholder="Maximum load capacity"
                                        value={form.capacityKg}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 text-slate-700 placeholder-slate-400"
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* Tyres Field */}
                            <div className="group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Number of Tyres
                                </label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                        <circle cx="12" cy="12" r="6" />
                                        <circle cx="12" cy="12" r="2" />
                                    </svg>
                                    <input
                                        type="number"
                                        name="tyres"
                                        placeholder="Total number of tyres"
                                        value={form.tyres}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 text-slate-700 placeholder-slate-400"
                                        required
                                        min="2"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                onClick={handleSubmit}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg shadow-lg transform transition-all duration-200 flex items-center justify-center space-x-2 ${isLoading
                                        ? 'bg-slate-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.49-8.49l2.83-2.83" />
                                        </svg>
                                        <span>Adding Vehicle...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Add Vehicle</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div className={`mt-6 p-4 rounded-xl border-l-4 ${message.includes('✅')
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                    : 'bg-red-50 border-red-400 text-red-700'
                                } animate-pulse`}>
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-medium">{message}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-slate-500">
                    <p className="text-sm">Secure vehicle registration system</p>
                </div>
            </div>
        </div>
    );
}