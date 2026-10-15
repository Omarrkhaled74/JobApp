import Joi from "joi";
import { generalFields } from "../../middelware/validation";

export const createRoom = Joi.object().keys({
    name:generalFields.userName.required()
}).required()
export const deleteRoom = Joi.object().keys({
    roomId:generalFields.id.required()
}).required()