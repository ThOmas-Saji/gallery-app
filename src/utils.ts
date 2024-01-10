export function formatDate(inputDateString) {
  const date = new Date(inputDateString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  return date.toLocaleDateString(undefined, options);
}
