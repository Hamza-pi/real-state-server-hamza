import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// ========================== Function to create new User ================
const createUser = asyncHandler(async (req, resp) => {
  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    resp.send({
      message: "User Registered Successfully. Please Login",
      user: user,
    });
  } else {
    throw new Error("User with this email already exists");
  }
});

// =============== Function to get All residencies Owned By User =============

const getOwnResd = asyncHandler(async (req, resp) => {
  const { email } = req.body;
  try {
    const residencies = await prisma.residency.findMany({
      where: { userEmail: email },
    });
    resp.send(residencies);
  } catch (error) {
    throw new Error(error.message);
  }
});

// =============== Function to get All Favourite residencies of User =============

const getFavResd = asyncHandler(async (req, resp) => {
  const { email } = req.body;
  try {
    const favResidencies = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    resp.send(favResidencies);
  } catch (error) {
    throw new Error(error.message);
  }
});
// =============== Function to book visit to residencies  =============

const bookVisit = asyncHandler(async (req, resp) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findFirst({
      where: {
        bookedVisits: { equals: { id } },
      },
    });
    if (!alreadyBooked) {
      const user = await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: {
            push: { id, date },
          },
        },
      });
      resp.send({ message: "Visit Is Booked", user });
    } else {
      resp.send({ message: "Already Booked By You" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

export { createUser, getOwnResd, getFavResd, bookVisit };
