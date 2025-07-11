/**
 * Convert datetime (Date object or string) to Vietnam timezone and format as "YYYY-MM-DD HH:mm:ss"
 */
function toVietnamTimeString(dateInput) {
  const date = new Date(dateInput);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Format: "11/07/2025, 18:17:34"
  const parts = formatter.formatToParts(date);
  const obj = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  return `${obj.year}-${obj.month}-${obj.day} ${obj.hour}:${obj.minute}:${obj.second}`;
}

function getCurrentVietnamTime() {
  return toVietnamTimeString(new Date());
}

function toVietnamDateString(dateInput) {
  const date = new Date(dateInput);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const obj = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  return `${obj.day}/${obj.month}/${obj.year}`;
}

function toVietnamTimeShort(dateInput) {
  const date = new Date(dateInput);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const obj = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  return `${obj.hour}:${obj.minute}`;
}

module.exports = {
  toVietnamTimeString,
  getCurrentVietnamTime,
  toVietnamDateString,
  toVietnamTimeShort,
};
