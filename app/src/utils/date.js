function toDateDifference(dateString) {
  const formattedDate = dateString.split(" ")[0].replaceAll("/", "-");
  const thatDay = new Date(formattedDate);
  const today = new Date();

  const diffTime = Math.abs(today - thatDay);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export {
  toDateDifference,
}