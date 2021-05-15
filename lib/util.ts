const intl = new Intl.DateTimeFormat("pt-BR", {
  timeStyle: "short",
  dateStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatarData(tempo: number) {
  return intl.format(tempo * 1000);
}
