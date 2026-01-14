export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/pill-icon.png',
      badge: '/pill-icon.png',
    });
  }
};

export const scheduleDoseNotification = (medicine, time) => {
  const now = new Date();
  const [hours, minutes] = time.split(':');
  const scheduleTime = new Date();
  scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  if (scheduleTime > now) {
    const delay = scheduleTime - now;
    setTimeout(() => {
      showNotification(
        'Medicine Reminder',
        `Prescribed dose due: ${medicine.name} – ${medicine.dosage}`
      );
    }, delay);
  }
};
