import { Router } from "express";
import { authentication, authorization } from "../../middleware/auth.middleware.js";
import * as user from './services/user.services.js'
import { validation } from "../../middleware/validation.middleware.js";
import { activeTwoStepVerification, changePrivileges, updatePassword, updateProfile } from "./user.validation.js";
import {fileTypes} from '../../utils/multer/local.multer.js'
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { endPoint } from "./user.endPoint.js";
const router = Router()

router.get('/profile',authentication(),user.getProfile)
router.get('/profile/:profileId',authentication(),user.shareProfile)

router.patch('/profile/settings/update',validation(updateProfile),authentication(),user.updateProfile)
router.patch('/profile/settings/updatePassword',validation(updatePassword),authentication(),user.updatePassword)

router.post('/profile/updateEmail',authentication(),user.updateEmail)
router.patch('/profile/resetEmail',authentication(),user.resetEmail)

// router.patch('/profile/image',authentication(),uploadDiskFile('user/profile',fileTypes.image).single('image'),user.updateImage)
router.patch('/profile/image',authentication(),uploadCloudFile(fileTypes.image).single('image'),user.updateImage)

// router.patch('/profile/coverImages',authentication(),uploadDiskFile('user/profile/cover',fileTypes.image).array('images',3),user.coverImages)
router.patch('/profile/coverImages',authentication(),uploadCloudFile(fileTypes.image).array('images',3),user.coverImages)

router.patch('/profile/twoStepVerification',authentication(),user.twoStepVerification)
router.patch('/profile/activeTwoStepVerification',authentication(),validation(activeTwoStepVerification),user.activeTwoStepVerification)

router.get('/adminProfile/dashBoard',authentication(),authorization(endPoint.admin),user.dashBoard)
router.patch('/adminProfile/changePrivileges',authentication(),authorization(endPoint.changePrivileges),validation(changePrivileges),user.changePrivileges)


export default router