const intl = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  dateStyle: "short",
});

export function formatarData(tempo: number) {
  return intl.format(tempo * 1000);
}
