import express from 'express';

// Server setup
const app = express();
const SERVER_PORT = 6002;

app.use(express.json());

// // User CRUD
// app.get("/users", getUserHandler);
// app.post("/users", createUserHandler);
// app.delete("/users", deleteUserHandler);
// app.put("/users", updateUserHandler);

// // Auth functionalities
// app.post("/login", loginHandler);
// app.post("/verify-jwt", verifyJWTHandler);

// Actually start listening to desired port
app.listen(SERVER_PORT, () => console.log(`Running on ${SERVER_PORT}...`));