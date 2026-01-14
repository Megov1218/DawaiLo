import dayjs from 'dayjs';

export const getTodaySchedule = (medicines, adherenceLogs) => {
  const today = dayjs().format('YYYY-MM-DD');
  const schedule = [];

  medicines.forEach(medicine => {
    if (!medicine.times || !Array.isArray(medicine.times)) return;

    medicine.times.forEach(time => {
      const timestamp = `${today}T${time}`;
      const log = adherenceLogs.find(
        l => l.medicineId === medicine.id && l.timestamp === timestamp
      );

      schedule.push({
        medicine,
        time,
        timestamp,
        status: log ? log.status : 'pending',
      });
    });
  });

  return schedule.sort((a, b) => a.time.localeCompare(b.time));
};

export const getAdherenceStats = (medicines, adherenceLogs) => {
  const today = dayjs().format('YYYY-MM-DD');
  let total = 0;
  let taken = 0;

  medicines.forEach(medicine => {
    if (!medicine.times) return;
    medicine.times.forEach(time => {
      const timestamp = `${today}T${time}`;
      total++;
      const log = adherenceLogs.find(
        l => l.medicineId === medicine.id && l.timestamp === timestamp
      );
      if (log && log.status === 'taken') taken++;
    });
  });

  return { total, taken, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
};
