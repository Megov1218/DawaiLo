import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import useAppStore from '../../store/useAppStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { api } from '../../utils/api';
import { requestNotificationPermission, scheduleDoseNotification } from '../../utils/notifications';

export default function PatientDashboard() {
  const user = useAppStore(state => state.user);
  const logout = useAppStore(state => state.logout);
  
  const [medicines, setMedicines] = useState([]);
  const [adherenceLogs, setAdherenceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState({ total: 0, taken: 0, percentage: 0 });

  useEffect(() => {
    loadData();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (medicines.length > 0) {
      calculateSchedule();
      
      // Schedule notifications
      medicines.forEach(medicine => {
        if (medicine.times) {
          medicine.times.forEach(time => scheduleDoseNotification(medicine, time));
        }
      });
    }
  }, [medicines, adherenceLogs]);

  const loadData = async () => {
    try {
      const [medsData, logsData] = await Promise.all([
        api.getMedicinesByPatient(user.id),
        api.getAdherenceLogs(user.id)
      ]);
      
      setMedicines(medsData);
      setAdherenceLogs(logsData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSchedule = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const scheduleItems = [];
    let totalDoses = 0;
    let takenDoses = 0;

    medicines.forEach(medicine => {
      if (!medicine.times || !Array.isArray(medicine.times)) return;

      medicine.times.forEach(time => {
        const timestamp = `${today}T${time}`;
        const log = adherenceLogs.find(
          l => l.medicine_id === medicine.id && 
               dayjs(l.scheduled_time).format('YYYY-MM-DDTHH:mm') === timestamp
        );

        totalDoses++;
        if (log && log.status === 'taken') takenDoses++;

        scheduleItems.push({
          medicine,
          time,
          timestamp,
          status: log ? log.status : 'pending',
        });
      });
    });

    scheduleItems.sort((a, b) => a.time.localeCompare(b.time));
    setSchedule(scheduleItems);
    setStats({
      total: totalDoses,
      taken: takenDoses,
      percentage: totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0
    });
  };

  const handleMarkDose = async (medicineId, timestamp, status) => {
    try {
      const result = await api.markDose({
        medicineId,
        patientId: user.id,
        scheduledTime: timestamp,
        status
      });

      if (result.success) {
        toast.success(status === 'taken' ? 'Dose marked as taken' : 'Dose marked as missed');
        loadData();
      } else {
        toast.error('Failed to mark dose');
      }
    } catch (error) {
      toast.error('Failed to mark dose');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
          <div className="flex items-center gap-4">
            <Link to="/patient/history" className="text-purple-600 font-semibold hover:text-purple-700">
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
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">Today's Adherence</h2>
          <p className="text-4xl font-bold">
            {stats.taken}/{stats.total} doses taken
          </p>
          <p className="text-2xl font-semibold mt-2">{stats.percentage}%</p>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
          
          {schedule.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No medicines scheduled for today.</p>
              <p className="text-sm text-gray-500">Your doctor will prescribe medicines when needed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition">
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
