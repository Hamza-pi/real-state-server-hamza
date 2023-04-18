import express from "express";
import {
  createUser,
  getOwnResd,
  getFavResd,
  bookVisit,
} from "../controllers/userCntrl.js";
import jwtCheck from "../config/auth0config.js";

const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.get("/ownresd", jwtCheck, getOwnResd);
router.post("/favresd/", jwtCheck, getFavResd);
router.post("/bookVisit/:id", jwtCheck, bookVisit);

export { router as authRoute };
