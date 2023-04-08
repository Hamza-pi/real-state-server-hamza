import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JSON_KEY, {
    expiresIn: "1d",
  });
};

export default generateToken;
