import express from "express";
import { notFound, errHandler } from "./middlewares/errorHandler.js";
import { authRoute } from "./routes/authRoute.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { residencyRoute } from "./routes/residencyRoute.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// ====================== Routes requests to server ======================

app.use("/api/user", authRoute);
app.use("/api/residency", residencyRoute);

// ====================== Middleware used by server ======================

app.use(notFound);
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
