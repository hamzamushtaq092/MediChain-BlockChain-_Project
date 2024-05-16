import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser,userDetails, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateAvatar} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', upload.fields([
  //here we are uploading multiple files with form data 
  //mtlb ky form ka data to submit ho reha ha to image or avatar b sath lety jao 
  //middleware jaty howe mujse mil ky jana 
  { name: 'avatar', maxCount: 1 }, // Expecting field named "avatar" from the client

]), registerUser);


router.route('/login').post( loginUser)

// secure routes
router.route('/user-details').post( userDetails)
 
router.route('/logout').post(verifyToken,logoutUser) // here we are using verify token middleware  in verifyToken we use next means after checking of token we call next and next call logout user  

router.route('/refresh-token').post(refreshAccessToken)

router.route('/change-password').post(verifyToken , changeCurrentPassword)

router.route('/current-user').get(verifyToken, getCurrentUser)

router.route('/update-account').patch(verifyToken, updateAccountDetails)

router.route('/avatar').patch(verifyToken, upload.single('avatar'),updateAvatar)








export default router;
