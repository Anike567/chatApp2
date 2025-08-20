const Redis = require('ioredis');

const master = new Redis({ host: "127.0.0.1", port: 6379 });

const replicas = [
  new Redis({ host: "127.0.0.1", port: 6380 }),
  new Redis({ host: "127.0.0.1", port: 6381 })
];

const getReplica = () => {
  const idx = Math.floor(Math.random() * replicas.length);
  return replicas[idx];
};

module.exports = { master, getReplica };
