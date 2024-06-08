import express from "express"
const router = express.Router()
import { generateToken, jwtAuthMiddleware } from "../middleware/auth.js";
import { userRegister, userProfilePhoto, getUserProfile, userLogin } from "../controllers/userController.js"
import { fileSizeValidator, upload } from "../config/uploadConfig.js";

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get("/profile", jwtAuthMiddleware, getUserProfile)
router.post("/profile/photo", fileSizeValidator, upload.single("profilePhoto"), userProfilePhoto)



export default router