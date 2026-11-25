export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value) {
  return `${value.toFixed(1)}%`;
}

export function greetingForHour(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function executionStats(summary) {
  const executed = summary.passed + summary.failed + summary.blocked;
  return {
    executed,
    executionPercent: (executed / summary.total) * 100,
    passRate: (summary.passed / executed) * 100,
  };
}
