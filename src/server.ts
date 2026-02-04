import express from 'express';
import { getHelloWorld } from './handlers/example';

// Server setup
const app = express();
const SERVER_PORT = 6002;

app.use(express.json());

// User CRUD
app.get("/", getHelloWorld);

// Actually start listening to desired port
app.listen(SERVER_PORT, () => console.log(`Running on ${SERVER_PORT}...`));