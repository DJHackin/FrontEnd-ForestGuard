import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({path: "./config/.env"});

// Server
app.listen(process.env.PORT, () => {
    console.log(`Le serveur écoute sur le port http://localhost:${process.env.PORT}`);
})