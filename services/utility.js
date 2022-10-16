export function convertNumber(number) {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function tokenGenerator() {
  return Math.floor(100000 + Math.random() * 900000);
}
