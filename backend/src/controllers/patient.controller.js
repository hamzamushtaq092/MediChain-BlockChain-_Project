import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const createPatient = asyncHandler(async (req, res) => {
    //1. get user details from front end
  //2.  validations( not empty,valid email etc)
  //3. check if user exists (by email, or username etc)
  // 4. check check report if any at time of creation
  // 5. upload them to cloudinary , and return url
  // 6. create user object - db entry
  // 7. remove password and refresh token from response
  // 8. check response
  // 9. return response

  const { fullName, username, email, password, dob, gender, bloodType ,allergies,medicalHistory,reports} = req.body; // deStructuring body

  

  console.log(
    fullName," full ", username," username ", email," email ", password," pass ", dob," dob ", gender," gender ", bloodType ," bloodtype ",allergies," allergies ",medicalHistory," history ",reports," reportts ",
  )
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError("All fields are required");
  }

  // here you can add more custom validations like email validation etc

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser){
    throw new ApiError(409, "User with email or username already exists");
  }

  const patient = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    dob,
    gender: gender ? gender.toLowerCase() : null,

    bloodType,
    allergies,
    role: "patient",

});

const createdPatient= await User.findOne({ _id: patient._id }).select(
  "-password -refreshToken"
)

if(!createdPatient){
  throw new ApiError(400, "Error while creating Patient ")
}

res.status(201).json(
  new ApiResponse(201, "Patient created successfully", createdPatient)
)

} );

const uploadReports = asyncHandler(async (req, res) => {
  //1. get user details from front end
  //2.  validations( not empty,valid email etc)
  
  // 4. check check report if any at time of creation
  // 5. upload them to cloudinary , and return url
  // 6. create user object - db entry
  // 7. remove password and refresh token from response
  // 8. check response
  // 9. return response

  const { reports } = req.body; // deStructuring body
  
})

const getPatientDetails = async (req, res) => {
  try {
    // Extract email from the request body
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      throw new ApiError(400, "Bad Request: Email is required");
    }

    // Query the database to find the user by email
    const user = await User.findOne({ email }).select("-password -refreshToken");
    console.log(user)

    // Check if user exists
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Send success response with user data
    return res.status(200).json(new ApiResponse(200, user, "User found successfully"));
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};






export { createPatient ,getPatientDetails};

