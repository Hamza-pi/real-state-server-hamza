import jwt from "jsonwebtoken";

const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JSON_KEY, { expiresIn: "3d" });
};

export default createRefreshToken;
