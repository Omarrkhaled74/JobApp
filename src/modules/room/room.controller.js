import { Router } from "express";
import { validation } from "../../middelware/validation.js";
import * as room from './service/room.service.js'
import {authentication} from '../../middelware/auth.js'
import { createRoom, deleteRoom } from "./room.validation.js";
const router = Router()

router.post('/createRoom',authentication(),validation(createRoom),room.createRoom)
router.get('/',authentication(),room.getAllRooms)
router.delete('/deleteRoom/:roomId',authentication(),validation(deleteRoom),room.deleteRoom)
router.get('/getChat/:roomId',authentication(),room.getRoomChat)


export default router