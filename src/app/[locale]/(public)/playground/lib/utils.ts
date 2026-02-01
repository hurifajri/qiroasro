interface Duration {
  minutes: number;
  seconds: number;
}

export function parseDuration(ms: number): Duration {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { minutes, seconds };
}
