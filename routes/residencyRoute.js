import express from "express";
import {
  toFav,
  createResidency,
  delResidency,
  updateResidency,
  getResidency,
  getAllResidencies,
} from "../controllers/residencyCntrl.js";
import jwtCheck from "../config/auth0config.js";

const router = express.Router();

router.post("/create", jwtCheck, createResidency);
router.put("/update/:id", jwtCheck, updateResidency);
router.delete("/delete/:id", jwtCheck, delResidency);
router.put("/tofav/:rid", jwtCheck, toFav);
router.get("/resd/:id", getResidency);
router.get("/allresd", getAllResidencies);

export { router as residencyRoute };
