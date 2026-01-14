export default function MedicineCard({ medicine, children }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{medicine.name}</h3>
      <div className="space-y-1 text-gray-700">
        <p><span className="font-semibold">Dosage:</span> {medicine.dosage}</p>
        <p><span className="font-semibold">Frequency:</span> {medicine.frequency}x per day</p>
        {medicine.times && (
          <p><span className="font-semibold">Times:</span> {medicine.times.join(', ')}</p>
        )}
        {medicine.duration && (
          <p><span className="font-semibold">Duration:</span> {medicine.duration.start} to {medicine.duration.end}</p>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
