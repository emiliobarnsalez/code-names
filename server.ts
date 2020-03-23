import express from 'express';
import cors from 'cors';
import { Server } from 'http';
import socketIO from 'socket.io';
import SessionsController from './backend/sessions-controller';
import SessionModel from './backend/session-model';

const sessionsController = new SessionsController();
const app: express.Application = express();

// Get whether the app is running in prod.
const isProd = process.argv.includes('--prod');

// Set the port.
const port = isProd ? process.env.PORT || 1337 : 1338;
app.set('port', port);

// Allow cross-origin in dev mode.
if (!isProd) {
  app.use(
    cors({
      origin: 'http://localhost:1337',
      optionsSuccessStatus: 200
    })
  );
}

// Serve the Angular app.
app.use(express.static('build/frontend'));

/**
 * Retrieves the card objects JSON for a given session name.
 *
 * If the session name exists, then return the existing session. If the session
 * name does not exist, then create a new session and return that session.
 */
app.get('/api/get', (request, response) => {
  const sessionName = request.query.sessionName;
  let session: SessionModel = null;
  if (sessionsController.sessionNames.includes(sessionName)) {
    session = sessionsController.getExistingSession(sessionName);
  } else {
    session = sessionsController.addNewSession(sessionName);
  }
  if (session === null) {
    response.send({
      error: `could not find or create session (${sessionName})`
    });
  } else {
    response.send(session.cardsObject);
  }
});

// Listen on port.
const server = new Server(app);
server.listen(port, () => {
  if (isProd) console.log(`Live at http://localhost:${port}!`);
  else console.log(`Backend running on http://localhost:${port}`);
});

// Socket.IO
let io = socketIO(server);
io.on('connection', socket => {
  console.log('new connection');
});