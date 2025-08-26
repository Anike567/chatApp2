const fs = require("fs");
const pino = require("pino");

// Create write stream for server.log
const logStream = fs.createWriteStream("./server.log", { flags: "a" });

// Create two loggers: one pretty for console, one raw for file
const prettyLogger = pino({
    level: "info",
    transport: {
        target: "pino-pretty",
        options: { colorize: true },
    },
});

const fileLogger = pino(logStream);

/**
 * 
 * @param {void} 
 * @argument{socket} 
 * 
 * log the details like ip method events and time and save it to server.log file to
 */

const logDetails = (socket) => {
  socket.onAny((event, ...args) => {
    const ip = socket.handshake.address;
    const transport = socket.conn.transport.name;

    const logObj = { ip, transport, event };

    const logLine = `Event received from client ${ip} | ${JSON.stringify(logObj)}`;

    prettyLogger.info(logLine);
    fileLogger.info(logLine);
  });
};

/**
 * flushes remaining logs before closing:
 */

const closeLoggerStream = () => {
  logStream.end(() => {
    console.log("Log stream closed.");
  });
};

module.exports = {logDetails,closeLoggerStream};
