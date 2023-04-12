//======================= Imports =====================
import { prisma } from "../config/prismaConfig.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"; // Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers

// -----------------------------------------------------------------------------------------------------------------

// ================== Middleware that authorize whether the user is legitimate or not by using token =================
const authMiddleware = asyncHandler(async (req, resp, next) => {
  let token;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JSON_KEY);
        const user = await prisma.user.findFirst({
          where: { id: decoded?.id },
        });
        if (user.refreshToken === "")
          throw new Error("You have logged out please login again");
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized or Token Expired. Please Login Again");
    }
  } else {
    throw new Error("No Token Attached to Request");
  }
});

export default authMiddleware;
