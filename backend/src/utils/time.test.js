const {
  toVietnamTimeString,
  getCurrentVietnamTime,
  toVietnamDateString,
  toVietnamTimeShort,
} = require("./time");

// Test các function xử lý thời gian
console.log("=== TEST TIME UTILS ===");

// Test 1: Convert SQL Server datetime
const sqlServerTime = new Date("2025-01-15T10:30:45.123Z");
console.log("SQL Server time:", sqlServerTime);
console.log("Vietnam time:", toVietnamTimeString(sqlServerTime));

// Test 2: Current time
console.log("Current Vietnam time:", getCurrentVietnamTime());

// Test 3: Date format
console.log("Date format:", toVietnamDateString(sqlServerTime));

// Test 4: Time format
console.log("Time format:", toVietnamTimeShort(sqlServerTime));

// Test 5: Various input formats
console.log("\n=== TEST VARIOUS FORMATS ===");
console.log("ISO string:", toVietnamTimeString("2025-01-15T10:30:45.123Z"));
console.log("Date object:", toVietnamTimeString(new Date()));
console.log("Timestamp:", toVietnamTimeString(1737021045123));

console.log("\n✅ Time utils test completed!");
