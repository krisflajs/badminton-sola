export default function emptyToNull(obj: {
  [key: string]: string | number | boolean | null | undefined;
}) {
  for (const key in obj) {
    if (obj[key] === "") {
      obj[key] = null;
    }
  }
  return obj;
}
