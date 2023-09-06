export const sanitizeRecText = (rec) => {
  const lineNumRegex = /^\d+\.\s*/;
  rec = rec.replace(lineNumRegex, "").trim();
  if (rec.endsWith(".")) {
    rec = rec.slice(0, -1);
  };
  if (rec.startsWith("-")) {
    rec = rec.slice(1);
  }
  return rec.trim();
}
