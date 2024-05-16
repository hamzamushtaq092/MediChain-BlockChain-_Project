import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  // question arise that how we can access cookies.
  //anser is we can use app.use(cookieParser()) in app.js

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      //todo discuss about front end
      throw new ApiError(401, "Unauthorized access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401,  "Invalid access token");
  }
});
