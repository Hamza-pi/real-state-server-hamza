import express from "express";
import {
  createUser,
  handleRefreshToken,
  loginUser,
  logoutUser,
  getOwnResd,
  getFavResd,
} from "../controllers/userCntrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refreshToken", handleRefreshToken);
router.get("/ownresd", authMiddleware, getOwnResd);
router.get("/favresd/", authMiddleware, getFavResd);

export { router as authRoute };
