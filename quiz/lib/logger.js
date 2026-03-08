"use strict";

const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, "..", "logs");
const APP_LOG = path.join(LOGS_DIR, "app.log");
const ERROR_LOG = path.join(LOGS_DIR, "error.log");

const LEVELS = { info: "INFO", warn: "WARN", error: "ERROR" };

function ensureLogsDir() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

function formatEntry(level, message, meta = {}) {
  const ts = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? " " + JSON.stringify(meta) : "";
  return `${ts} [${level}] ${message}${metaStr}\n`;
}

function write(logPath, entry) {
  try {
    ensureLogsDir();
    fs.appendFileSync(logPath, entry);
  } catch (err) {
    console.error("Logger write failed:", err.message);
  }
}

function log(level, message, meta = {}) {
  const entry = formatEntry(LEVELS[level] || "INFO", message, meta);
  write(APP_LOG, entry);
  if (level === "error") write(ERROR_LOG, entry);
}

module.exports = {
  info(message, meta) {
    log("info", message, meta);
  },
  warn(message, meta) {
    log("warn", message, meta);
  },
  error(message, meta = {}) {
    if (meta.err && meta.err instanceof Error) {
      meta.err = { message: meta.err.message, stack: meta.err.stack };
    }
    log("error", message, meta);
  },
};
