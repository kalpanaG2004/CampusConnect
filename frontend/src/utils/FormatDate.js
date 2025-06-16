export function formatDateTime(dateString) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formattedDate} ${formattedTime}`;
}
