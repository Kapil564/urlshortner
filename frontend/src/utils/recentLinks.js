const KEY = "recent_links";
const MAX = 10;

export function saveRecentLink(originalUrl, shortCode) {
  const existing = JSON.parse(localStorage.getItem(KEY)) || [];

  const updated = [
    {
      originalUrl,
      shortCode,
      createdAt: Date.now()
    },
    ...existing.filter(l => l.shortCode !== shortCode)
  ].slice(0, MAX);

  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getRecentLinks() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}
