import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";
import generateToken from "../config/jsonToken.js";
import createRefreshToken from "../config/refreshToken.js";
import bcrypt from "bcrypt";

// ========================== Function to create new User ================
const createUser = asyncHandler(async (req, resp) => {
  let { email, password } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    req.body.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: req.body });
    resp.send({
      message: "User Registered Successfully. Please Login",
      user: user,
    });
  } else {
    throw new Error("User with this email already exists");
  }
});

// ========================== Function to login User ================

const loginUser = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (user && bcrypt.compare(password, user?.password)) {
      const refreshToken = createRefreshToken(user?.id);
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { refreshToken: refreshToken },
      });
      resp.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      });
      resp.send({
        name: updatedUser?.name,
        profilePic: updatedUser?.image,
        email: updatedUser?.email,
        favResidenciesID: updatedUser?.favResidenciesID,
        accessToken: generateToken(updatedUser?.id),
      });
    } else {
      throw new Error("Invalid Credentials Or User does not exists");
    }
  } catch (err) {
    throw new Error(err);
  }
});
// ========================== Function to Handle Refresh Token ================

const handleRefreshToken = asyncHandler(async (req, resp) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  if (!refreshToken) throw new Error("No refresh token attached");
  const user = await prisma.user.findUnique({
    where: { refreshToken: refreshToken },
  });
  if (!user) throw new Error("Invalid Refresh Token");
  const token = generateToken(user?.id);
  resp.send({ accessToken: token });
});

// ========================== Function to logOut User ================

const logoutUser = asyncHandler(async (req, resp) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  if (!refreshToken) throw new Error("No Refresh Token Found");
  const user = await prisma.user.findUnique({
    where: { refreshToken: refreshToken },
  });
  if (!user) {
    resp.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return resp.status(204);
  } else {
    await prisma.user.update({
      where: { refreshToken: refreshToken },
      data: { refreshToken: "" },
    });
    resp.clearCookie("refreshToken", { httpOnly: true, secure: true });
    resp.send({ message: "You have logged out" });
  }
});

// =============== Function to get All residencies Owned By User =============

const getOwnResd = asyncHandler(async (req, resp) => {
  const { id } = req.user;
  try {
    const residencies = await prisma.residency.findMany({
      where: { userId: id },
    });
    resp.send(residencies);
  } catch (error) {
    throw new Error(error.message);
  }
});

// =============== Function to get All Favourite residencies of User =============

const getFavResd = asyncHandler(async (req, resp) => {
  const { id } = req.user;
  try {
    const favResidencies = await prisma.user.findUnique({
      where: { id: id },
      select: { favResidenciesID: true },
    });
    resp.send(favResidencies);
  } catch (error) {
    throw new Error(error.message);
  }
});
export {
  createUser,
  loginUser,
  logoutUser,
  handleRefreshToken,
  getOwnResd,
  getFavResd,
};
