import { asyncHandler } from "../../../utils/err/err.js";


import * as dbService from '../../../DB/dbService.js'
import { roomModel } from "../../../DB/model/Room.model.js";
import { successResponse } from "../../../utils/response.js";
import { populate } from "dotenv";
import { authenticationSocket } from "../../../middleware/auth.middleware.js";


export const createRoom = asyncHandler(
    async(req,res,next)=>{
        const {name} = req.body

        const findRoom = await dbService.findOne({
            model:roomModel,
            filter:{
                name
            }
            
        })



        if (findRoom) {
            return next (new Error ('this name is user',{cause:400}))
        }

        const create = await dbService.create({
            model:roomModel,
            data:{
                name,
                createdBy:req.user._id
            }
        })


        return successResponse({res,status:201,data:{name:create.name,id:create._id}})

    }
)










export const getAllRooms = asyncHandler(
    async(req,res,next)=>{
        const {name} = req.body

        const rooms = await dbService.findAll({
            model:roomModel,
            select:{name:1,_id:1}
            
        })



      

        return successResponse({res,status:200,data:{rooms}})

    }
)




export const deleteRoom = asyncHandler(
    async(req,res,next)=>{
        const {roomId} = req.params

        const room = await dbService.findOneAndDelete({
            model:roomModel,
            filter:{
                _id:roomId,
                createdBy:req.user._id
            }
            
        })

        if (!room) {
            return next (new Error ('only owner can delete the room',{cause:404}))
        }

       
      

        return successResponse({res,status:200,data:{}})

    }
)



// export const getRoomChat = asyncHandler(
//     async(req,res,next)=>{
//         const {roomId}=req.params

//         const getRoom = await dbService.findOne({
//             model:roomModel,
//             filter:{
//                 _id:roomId
//             }
//         })

//         if (!getRoom) {
//             return next (new Error('invalid roomId',{cause:404}))
//         }


//         const getRoomChat = await dbService.findOne({
//             model:roomModel,
//             filter:{
//                 _id:roomId
//             },
//             populate:[{path:'message',select:'message senderId',populate:[{path:'senderId',select:'userName'}]}]
//         })

//         console.log(getRoomChat);
        

//         return successResponse({res,data:{getRoomChat}})

//     }
// )


export const getRoomChat = asyncHandler(
    async (req, res, next) => {
        const { roomId } = req.params;

        const getRoomChat = await dbService.findOne({
            model: roomModel,
            filter: { _id: roomId },
            populate: [
                {
                    path: 'message',
                    select: 'message senderId createdAt',
                    populate: { path: 'senderId', select: 'userName' }
                }
            ]
        });

        if (!getRoomChat) {
            return next(new Error('invalid roomId', { cause: 404 }));
        }

      
        const chatMessages = getRoomChat.message.map(msg => ({
            userName: msg.senderId?.userName,
            message: msg.message,
            timStamp:msg.createdAt
        }));

        return successResponse({ res, data: chatMessages });
    }
);



export const joinRoom = async(socket,io,roomId)=>{
   
    if (!authResult.data.valid) {
        return socket.emit("error", authResult.data.message);
    }

    const user = authResult.data.user;

    // تحديث قاعدة البيانات بإضافة المستخدم للغرفة
    const updatedRoom = await dbservice.findOneAndUpdate({
        model: roomModel,
        filter: { _id: roomId },
        data: { $addToSet: { users: user._id } }, // يضيف المستخدم بدون تكرار
        options: { new: true } // يرجع البيانات المحدثة
    });

    if (!updatedRoom) {
        return socket.emit("error", "Room not found");
    }

    socket.join(roomId);

    io.to(roomId).emit("userJoined", `${user.username} has joined the room`);
}


export const leaveRoom = async (socket, io, roomId) => {
    const authResult = await authenticationSocket({ socket });

    if (!authResult.data.valid) {
        return socket.emit("error", authResult.data.message);
    }

    const user = authResult.data.user;

   
    const updatedRoom = await dbservice.findOneAndUpdate({
        model: roomModel,
        filter: { _id: roomId },
        data: { $pull: { users: user._id } },
        options: { new: true }
    });

    if (!updatedRoom) {
        return socket.emit("error", "Room not found");
    }

    socket.leave(roomId);

    io.to(roomId).emit("userLeft", `${user.username} has left the room`);
};


export const sendMessage = async (socket, io, roomId, message) => {
    const authResult = await authenticationSocket({ socket });

    if (!authResult.data.valid) {
        return socket.emit("error", authResult.data.message);
    }

    const user = authResult.data.user;

   
    const newMessage = await dbservice.create({
        model: messageModel,
        data: {
            roomId,
            senderId: user._id,
            message
        }
    });

    if (!newMessage) {
        return socket.emit("error", "Failed to send message");
    }

   
    io.to(roomId).emit("newMessage", {
        sender: user.username,
        message: newMessage.message,
        timestamp: newMessage.createdAt
    });
};
