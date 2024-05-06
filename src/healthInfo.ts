import http from 'http';
import { pmaLogger } from './pma-logger';

const port = 9000;

http
  .createServer((_, res) => {
    const uptime = process.uptime();
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    const healthMessage = {
      message: 'PMA-Bot is healthy',
      uptime,
      timestamp: Date.now(),
    };
    try {
      res.end(JSON.stringify(healthMessage));
    } catch (error) {
      healthMessage.message = JSON.stringify({ error });
      res.writeHead(503);
      res.end(JSON.stringify(healthMessage));
    }
  })
  .listen(port, () => {
    pmaLogger.info(`Health Server running on port ${port}`);
  });
