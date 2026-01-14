import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import StatusBadge from '../../components/StatusBadge';
import { getTodaySchedule, getAdherenceStats } from '../../utils/schedule';
import { requestNotificationPermission, scheduleDoseNotification } from '../../utils/notifications';

export default function PatientDashboard() {
  const user = useAppStore(state => state.user);
  const medicines = useAppStore(state => state.medicines);
  const adherenceLogs = useAppStore(state => state.adherenceLogs);
  const markDose = useAppStore(state => state.markDose);
  const logout = useAppStore(state => state.logout);

  const schedule = getTodaySchedule(medicines, adherenceLogs);
  const stats = getAdherenceStats(medicines, adherenceLogs);

  useEffect(() => {
    requestNotificationPermission();
    medicines.forEach(medicine => {
      if (medicine.times) {
        medicine.times.forEach(time => scheduleDoseNotification(medicine, time));
      }
    });
  }, [medicines]);

  const handleMarkDose = (medicineId, timestamp, status) => {
    markDose(medicineId, timestamp, status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
          <div className="flex items-center gap-4">
            <Link to="/patient/history" className="text-indigo-600 font-semibold hover:text-indigo-700">
              History
            </Link>
            <span className="text-gray-700">{user?.name}</span>
            <button onClick={logout} className="text-red-600 font-semibold hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Today's Adherence</h2>
          <p className="text-3xl font-bold text-indigo-600">
            {stats.taken}/{stats.total} doses taken ({stats.percentage}%)
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
          
          {schedule.length === 0 ? (
            <p className="text-gray-600">No medicines scheduled for today.</p>
          ) : (
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.medicine.name}</h3>
                      <p className="text-gray-700">{item.medicine.dosage}</p>
                      <p className="text-gray-600">Time: {item.time}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  {item.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkDose(item.medicine.id, item.timestamp, 'taken')}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        ✅ Mark Taken
                      </button>
                      <button
                        onClick={() => handleMarkDose(item.medicine.id, item.timestamp, 'missed')}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        ❌ Mark Missed
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
