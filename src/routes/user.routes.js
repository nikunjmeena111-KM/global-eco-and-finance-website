import { Router } from "express";
import { 
  loginUser,
  logoutUser, 
  registerUser,  
  changePassword,
  updateProfilePicture,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/authVarification.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.route("/register").post(
  authLimiter,
  upload.fields([
    {
      name: "profilePicture",
      maxCount: 1
    }
  ]),
  registerUser
);

router.route("/login").post(authLimiter,loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").post(
  verifyJWT,
  changePassword
);

router.route("/update-profile-picture").post(
  verifyJWT,
  upload.single("profilePicture"),
  updateProfilePicture
);

export default router;