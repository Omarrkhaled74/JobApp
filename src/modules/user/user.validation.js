import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { roleTypes } from "../../DB/models/user.model.js";


export const shareProfile = joi.object().keys({
    profileId: generalFields.id.required()
}).required()



export const updateProfile = joi.object().keys({
    userName:generalFields.userName,
    phone:generalFields.phone,
    gender:generalFields.gender,
    DOB:generalFields.DOB
}).required()


export const updatePassword = joi.object().keys({
    password:generalFields.password.not(joi.ref('oldPassword')).required(),
    oldPassword:generalFields.password.required(),
    confirmPassword:generalFields.confirmPassword.required()
}).required()


export const activeTwoStepVerification= joi.object().keys({
    code:generalFields.code.required()
}).required()


export const changePrivileges = joi.object().keys({
    userId:generalFields.id.required(),
    role:joi.string().valid(roleTypes.user,roleTypes.admin)
}).required()