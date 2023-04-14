import { auth } from "express-oauth2-jwt-bearer";
const jwtCheck = auth({
  audience: "http://localhost:8000/api",
  issuerBaseURL: "https://dev-1ugfh4m61qhkg17d.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

export default jwtCheck;
