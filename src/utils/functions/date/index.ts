export function isValidISODate(date: Date): boolean {
  return !isNaN(date.getTime());
}
