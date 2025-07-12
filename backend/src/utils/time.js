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

function fixDateTimeVN(dt) {
  if (!dt) return null;

  // Nếu là ISO string (có chữ T hoặc Z), thì cắt phần .xxxZ (ưu tiên xử lý string trước)
  if (typeof dt === "string" && (dt.includes("T") || dt.endsWith("Z"))) {
    return dt.replace("T", " ").slice(0, 19);
  }

  // Nếu là Date object, lấy giờ UTC (không theo timezone local)
  if (dt instanceof Date) {
    const year = dt.getUTCFullYear();
    const month = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dt.getUTCDate()).padStart(2, "0");
    const hours = String(dt.getUTCHours()).padStart(2, "0");
    const minutes = String(dt.getUTCMinutes()).padStart(2, "0");
    const seconds = String(dt.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Nếu là dạng 'YYYY-MM-DD HH:mm:ss.xxx' thì cắt phần .xxx
  if (
    typeof dt === "string" &&
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+$/.test(dt)
  ) {
    return dt.slice(0, 19);
  }

  // Nếu là dạng 'YYYY-MM-DD HH:mm:ss' (đã là VN), trả về luôn
  return dt;
}

// Lưu ý: Chỉ dùng fixDateTimeVN để format datetime lấy từ DB (trả về đúng như DB, không cộng offset, không T, Z, không milliseconds)

module.exports = {
  toVietnamTimeString,
  getCurrentVietnamTime,
  toVietnamDateString,
  toVietnamTimeShort,
  fixDateTimeVN,
};
