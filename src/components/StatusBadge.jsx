export default function StatusBadge({ status }) {
  const styles = {
    taken: 'bg-green-100 text-green-800 border-green-300',
    missed: 'bg-red-100 text-red-800 border-red-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const labels = {
    taken: '✅ Taken',
    missed: '❌ Missed',
    pending: '🕒 Pending',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
