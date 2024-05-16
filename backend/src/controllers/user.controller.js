import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"; 

import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // validateBeforeSave is used to avoid saving the thing which are required in the db means that as in db password is required feild so when ever we update the db we need to give them required fields

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);

    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //1. get user details from front end
  //2.  validations( not empty,valid email etc)
  //3. check if user exists (by email, or username etc)
  // 4. check images ,awatar
  // 5. upload them to cloudinary , avatar and return url
  // 6. create user object - db entry
  // 7. remove password and refresh token from response
  // 8. check response
  // 9. return response

  const { fullName, username, email, password,role } = req.body; // deStructuring body
  console.log(
    "email",
    email,
    "password",
    password,
    "username ",
    username,
    "js ",
    fullName,
    "role ",
    role
  );

  // beginer user level validations

  // if(fullName==="" || !username || !email || !password){
  //     throw new ApiError('All fields are required',400)
  // }

  // advance level validations\

  if (
    [fullName, username, email, password, role].some((field) => field?.trim() === "")
  ) {
    throw new ApiError("All fields are required");
  }

  // here you can add more custom validations like email validation etc
  // usally in production grade applicaton we use seperate validation file and import validations here

  // check if user exists in database
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], // $or means or in mongo dbemail})
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar are required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
 

  if (!avatar) {
    throw new ApiError(400, "Avatar or is not uploaded on cloudinary");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    role: role ,
  
  });

  // remove password and refreshToken from response
  const createdUserName = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUserName) {
    throw new ApiError(500, "something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUserName, "User Register successfully"));
});

// 1. get user details from req.body===> data
// 2.  validations( not empty,valid email etc)
// 3. check if user exists (by email, or username etc)
// 4. check password
// 5. generate access token and refresh token
// 6. send cookies

// 7. return response

const userDetails = async (req, res) => {
  try {
      const inCommingAccessToken = req.body // Assuming token is sent as accessToken in the request body

      const accessToken = inCommingAccessToken.accessToken

      console.log(accessToken)
    

      if (!accessToken) {
          throw new ApiError(401, "Unauthorized Request: Access Token missing");
      }

      const decodedToken = jwt.verify(
        accessToken,
          process.env.ACCESS_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id).select("-password -refreshToken");

      if (!user) {
          throw new ApiError(404, "User not found");
      }

      return res.status(200).json(new ApiResponse(200, user, "User found successfully"));
  } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(error.statusCode || 500).json({ error: error.message });
  }
}



const loginUser = asyncHandler(async (req, res) => {

  //const { username, email, password } = req.body;
  const { email, password } = req.body;

  console.log( email, password);

  if (  !email) {
    throw new ApiError(400, "username and email are required");
  }

 // const user = await User.findOne({ $or: [{ username }, { email }] });
 const user = await User.findOne( { email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
  
    throw new ApiError(400, "Invalid users credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

 

  // send cookies

  const options = {
    // here the purpose of httponly and secure is to make sure that the cookie is not accessible by frontend can be update or modiled by the server
    httpOnly: true,
    secure: true,
  };
  console.log("user logged in successfully")

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
      
    );
    
});

const logoutUser = asyncHandler(async (req, res) => {
  //here problem arise that how to logout user how to get user_id ,
  //in login case we take user email from user thats why we are able to get   user_id

  //

  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1// this field is removed from document
      },
    },
    {
      new: true,
    }
  );
  const options = {
    // here the purpose of httponly and secure is to make sure that the cookie is not accessible by frontend can be update or modiled by the server
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const inCommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken; // req.body is for mobile apps

  if (!inCommingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      inCommingRefreshToken,
      process.env.REFERSH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (inCommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      // here the purpose of httponly and secure is to make sure that the cookie is not accessible by frontend can be update or modiled by the server
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findOne(req.user?._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "CURRENT USER FETCHED successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Please provide full name and email");
  }
  User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account details updated successfully"));
});

// here some productiom type info is that if u want to update any file to uska seperate function banao

const updateAvatar = asyncHandler(async (req, res) => {
  // req.file come from multer middleware
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please provide avatar ");
  }

  // Assignment: Delete previous avatar on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while  uploading avatar");
  }

  avatar = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, avatar, "Avatar updated successfully"));
});








export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  userDetails
};
