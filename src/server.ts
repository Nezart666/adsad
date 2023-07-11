import url from 'url';
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import nunjucks from 'nunjucks';
import SHA256 from 'fast-sha256';
import arrayBufferToHex from 'array-buffer-to-hex';

import { Server as WebSocketServer } from 'ws';
import UptimeWSServer from './uptimeWS';
import { startServer } from './moomoo/moomoo';
import { getGame } from './moomoo/Game';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

dotenv.config();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

const VERSION = "0.0.0a";

function format(timestamp) {
  const hours = Math.floor(timestamp / (60 * 60));
  const minutes = Math.floor((timestamp % (60 * 60)) / 60);
  const seconds = Math.floor(timestamp % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

app.get('/sanctuary', (req, res) => {
  if (req.accepts('html')) {
    res.render('version.html', { version: VERSION, nodeVersion: process.version, uptime: format(process.uptime()) });
  } else {
    res.send(`Sanctuary v${VERSION}`);
  }
});

app.get('/uptime', (req, res) => {
  if (req.accepts('html')) {
    res.redirect('/sanctuary');
  } else {
    res.send(format(process.uptime()));
  }
});

app.get('/', (req, res) => {
  res.redirect('https://moomoo.io');
});

app.get('/api/v1/playerCount', (_req, res) => {
  const game = getGame();
  if (!game) {
    res.json({ type: "error", message: "No game active." });
  } else {
    res.json({ type: "success", playerCount: game.clients.length });
  }
});

app.get('/api/v1/players', (req, res) => {
  const game = getGame();
  if (!game) {
    res.json({ type: "error", message: "No game active." });
  } else {
    const clients = game.clients.map(client => ({
      clientIPHash: arrayBufferToHex(SHA256(new TextEncoder().encode(client.ip))),
      playerName: client.player?.name || "Red Dragon",
      playerID: client.player?.id || -1
    }));

    res.json({ type: "success", clients });
  }
});

const wss = new WebSocketServer({ noServer: true });
startServer(wss);

const uptimeServer = new WebSocketServer({ noServer: true });
new UptimeWSServer(uptimeServer);

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname?.replace(/\/$/, '');

  if (pathname === '/uptimeWS') {
    uptimeServer.handleUpgrade(request, socket, head, ws => {
      uptimeServer.emit('connection', ws, request);
    });
  } else if (pathname === '/moomoo') {
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, () => console.log(`Sanctuary listening at https://localhost:${port}`));
