export function isIPv4(value: string) {
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    const num = Number(p);
    return num >= 0 && num <= 255;
  });
}
// remember to delete this comment make code cleaner
//https://www.geeksforgeeks.org/dsa/how-to-validate-a-domain-name-using-regular-expression/#:~:text=How%20to%20validate%20a%20domain%20name%20using%20Regular%20Expression

export function isDomain(value: string) {
  if (value.includes("://")) return false;
  if (value.includes(" ")) return false;
  const regex = /^(?=.{1,253}$)(?!-)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;
  return regex.test(value);
}
