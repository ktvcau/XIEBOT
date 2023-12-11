const logger = {
  info: (message) => {
      console.log(`\x1b[36m[INFO]\x1b[0m ${message}`);
  },
  warn: (message) => {
      console.log(`\x1b[35m[WARN]\x1b[0m ${message}`);
  },
  error: (message) => {
      console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`);
  },
  system: (message) => {
      console.log(`\x1b[36m[SYSTEM]\x1b[0m ${message}`);
  },
  custom: (message, type, color = "\x1b[36m") => {
      console.log(`${color}[${type}]\x1b[0m ${message}`);
  },
};

export default logger;
