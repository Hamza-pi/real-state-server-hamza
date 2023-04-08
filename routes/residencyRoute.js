import express from "express";
import {
  toFav,
  createResidency,
  delResidency,
  updateResidency,
  getResidency,
  getAllResidencies,
} from "../controllers/residencyCntrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createResidency);
router.put("/update/:id", authMiddleware, updateResidency);
router.delete("/delete/:id", authMiddleware, delResidency);
router.put("/tofav/:rid", authMiddleware, toFav);
router.get("/resd/:id", getResidency);
router.get("/allresd/", getAllResidencies);

export { router as residencyRoute };
