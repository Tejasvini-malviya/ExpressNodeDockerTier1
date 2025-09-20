import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import errorHandler from "./Middleware/errorhandler.js";
import CreateUserTable from "./Data/createTable.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_HOST = process.env.DB_HOST || "localhost";

// Middleware (should come before routes)
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hy there");
});

app.use("/api", userRouter);

//Create table before starting the server
CreateUserTable();


// Testing postgres connection
app.get("/test", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT current_database()");
    res.send(`The database connected is: ${result.rows[0].current_database}`);
  } catch (err) {
    next(err); // pass error to middleware
  }
});

//error handling middleware (should be last)
app.use(errorHandler);

// Server running
app.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});
