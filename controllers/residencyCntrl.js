import { prisma } from "../config/prismaConfig.js";
import asyncHandler from "express-async-handler";
import cloudinaryUploadImage from "../config/cloudinary.js";
// =============== Function to create new residency =============

const createResidency = asyncHandler(async (req, resp) => {
  const { id } = req.user;
  const { title, description, price, location, images } = req.body;
  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        location,
        images,
        owner: { connect: { id: id } },
      },
      include: { owner: true },
    });
    resp.send({ message: "Residency Created Successfully", residency });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error(`A residency with location ${location} already exists.`);
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
  const { id } = req.user;
  const { rid } = req.params;
  try {
    const favResd = await prisma.residency.findFirst({
      where: {
        favByIds: { equals: id },
      },
      select: {
        favByIds: true,
      },
    });
    if (favResd) {
      const residency = await prisma.residency.update({
        where: { id: rid },
        data: {
          favByIds: { set: favResd.favByIds.filter((id) => id !== id) },
        },
      });
      resp.send({ message: "Removed from favourites", residency });
    } else {
      const residency = await prisma.residency.update({
        where: { id: rid },
        data: {
          favByIds: { push: id },
        },
      });
      resp.send({ message: "Added To Favourites", residency });
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

// =============== Function to upload residency image =============
const uploadResdImg = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newUrl = await uploader(path);
      urls.push(newUrl);
      fs.unlinkSync(path);
    }
    const uploadedPrdctImg = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((url) => {
          return url;
        }),
      },
      { new: true }
    );
    resp.send(uploadedPrdctImg);
  } catch (error) {
    throw new Error(error);
  }
});
export {
  createResidency,
  updateResidency,
  delResidency,
  toFav,
  getAllResidencies,
  getResidency,
  uploadResdImg,
};
