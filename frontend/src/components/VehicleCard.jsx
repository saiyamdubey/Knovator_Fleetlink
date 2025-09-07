export default function VehicleCard({ vehicle, onBook }) {
    return (
        <div className="border rounded-lg shadow-md p-6 bg-blue-200 flex justify-between items-center hover:shadow-lg transition">
            <div>
                <h2 className="text-xl font-semibold">{vehicle.name}</h2>
                <p className="text-gray-600">Capacity: {vehicle.capacityKg} Kg</p>
                <p className="text-gray-600">Tyres: {vehicle.tyres}</p>
                {vehicle.estimatedRideDurationHours && (
                    <p className="text-gray-600">
                        Estimated Duration: {vehicle.estimatedRideDurationHours} hrs
                    </p>
                )}
            </div>
            <button
                onClick={() => onBook(vehicle._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
                🚚 Book Now
            </button>
        </div>
    );
}
