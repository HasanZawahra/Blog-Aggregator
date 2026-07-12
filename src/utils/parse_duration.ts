export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(`Invalid duration format: '${durationStr}'. Expected formats like '1s', '5m', '2h'.`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'ms': return value;
    case 's':  return value * 1000;
    case 'm':  return value * 60000;
    case 'h':  return value * 3600000;
    default:   return 0;
  }
}
