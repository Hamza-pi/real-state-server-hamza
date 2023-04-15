import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";
// =============== Function to create new residency =============

const createResidency = asyncHandler(async (req, resp) => {
  const { email } = req.body;
  const { title, description, price, address, city, images, facilities } =
    req.body;
  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        city,
        facilities,
        images,
        owner: { connect: { email: email } },
      },
    });
    resp.send({ message: "Residency Created Successfully", residency });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error(`A residency with address ${address} already exists.`);
    }
    throw new Error(error.message);
  }
});

// =============== Function to update residency =============

const updateResidency = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const updatedResd = await prisma.residency.update({
      where: { id },
      data: req.body,
    });
    resp.send(updatedResd);
  } catch (error) {
    throw new Error(error.message);
  }
});

// =============== Function to delete residency =============

const delResidency = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const deletedResd = await prisma.residency.delete({
      where: { id: id },
    });
    resp.send({ message: "Deleted Successfully", deletedResd });
  } catch (error) {
    throw new Error(error.message);
  }
});
// =============== Function to add residency to favourites =============

const toFav = asyncHandler(async (req, resp) => {
  const { email } = req.body;
  const { rid } = req.params;
  try {
    const alreadyAdded = await prisma.user.findFirst({
      where: { favResidenciesID: { equals: rid } },
    });
    if (alreadyAdded !== null) {
      const user = await prisma.user.update({
        where: { email: email },
        data: {
          favResidenciesID: {
            set: alreadyAdded.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });
      resp.send({ message: "Removed From Favourites", user });
    } else {
      const user = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      resp.send({ message: "Added to Favourites", user });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

// =============== Function to get residency =============

const getResidency = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const residency = await prisma.residency.findUnique({
      where: { id },
    });
    resp.send(residency);
  } catch (error) {
    throw new Error(error.message);
  }
});

// =============== Function to get All residencies =============

const getAllResidencies = asyncHandler(async (req, resp) => {
  const residencies = await prisma.residency.findMany();
  resp.send(residencies);
});

export {
  createResidency,
  updateResidency,
  delResidency,
  toFav,
  getAllResidencies,
  getResidency,
};
