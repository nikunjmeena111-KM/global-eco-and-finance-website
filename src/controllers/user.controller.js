import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOncloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";



// controller to register user
const registerUser = asyncHandler(async (req , res)=>{

const { fullName , email , password } = req.body;

if([ fullName,email,password].some((field)=>field?.trim()==="")){
    throw new ApiError(400 , "all fields are required");
}

const existedUser = await User.findOne({ email });

if(existedUser){
    throw new ApiError(409 , "user already exist");
}

const profilePictureLocalPath= req.files?.profilePicture?.[0]?.path;

if(!profilePictureLocalPath){
    throw new ApiError(400,"profile image is required");
}

const profilePicture = await uploadOncloudinary(profilePictureLocalPath);

if(!profilePicture){
    throw new ApiError(500,"failed to upload profile image");
}

const user= await User.create({
    fullName,
    profilePicture:profilePicture.url,
    email,
    password,
});

const createdUser = await User.findById(user._id).select("-password -refreshToken");

if(!createdUser){
    throw new ApiError(500,"user creation failed");
}

logger.info({ layer: "controller", service: "auth", action: "registerUser", message: "User registered", email });

return res.status(201).json(
    new ApiResponse(201,createdUser,"user registered successfully")
);

});



// controller to login user
const loginUser = asyncHandler(async (req,res)=>{

const { email, password }= req.body;

if(!email || !password){
    throw new ApiError(400 ,"email and password required");
}

const user = await User.findOne({ email });

if(!user){
    throw new ApiError(404,"user not found");
}

const isPasswordValid = await user.isPasswordCorrect(password);

if(!isPasswordValid){
    throw new ApiError(401,"incorrect password");
}

const accessToken = user.generateAccessToken();

const loggedUser = await User.findById(user._id).select("-password -refreshToken");

const options ={
    httpOnly: true,
    secure: true
};

logger.info({ layer: "controller", service: "auth", action: "loginUser", message: "User logged in", email });

res
.status(200)
.cookie("accessToken",accessToken,options)
.json(
    new ApiResponse(200,
    {
       user : loggedUser,
       accessToken
    },
    "user logged in successfully"
     )
  );

});




// controller to logout user
const logoutUser = asyncHandler(async (req,res)=>{

const options ={
    httpOnly: true,
    secure:true
};

logger.info({ layer: "controller", service: "auth", action: "logoutUser", message: "User logged out", userId: req.user?._id });

res
.status(200)
.clearCookie("accessToken", options)
.json(new ApiResponse(200,{},"user logged out successfully"));

});



// change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new password required");
  }

  const user = await User.findById(req.user._id);

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.password = newPassword; // will auto-hash via pre-save
  await user.save();

  res.status(200).json(
    new ApiResponse(200, null, "Password updated successfully")
  );
});


//update profile picure
const updateProfilePicture = asyncHandler(async (req, res) => {

  const filePath = req.file?.path;

  if (!filePath) {
    throw new ApiError(400, "Profile image required");
  }

  const uploaded = await uploadOncloudinary(filePath);

  if (!uploaded) {
    throw new ApiError(500, "Image upload failed");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: uploaded.url },
    { returnDocument: "after" }
  ).select("-password");

  res.status(200).json(
    new ApiResponse(200, user, "Profile updated successfully")
  );
});


export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    updateProfilePicture 
};