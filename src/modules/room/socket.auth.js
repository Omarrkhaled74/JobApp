import { socketConnections } from "../../../DB/models/company.model.js"
import { socketConnections } from "../../../DB/models/user.model.js"
import { authenticationSocket } from "../../middelware/auth.js"

export const registerSocket= async(socket)=>{
    const {data} = await authenticationSocket({socket})
    if (!data.valid) {
     return   socket.emit('socketErrorResponse',data)
    }

    socketConnections.set(data.user._id.toString(),socket.id)
    // console.log(socketConnections);
    
    return 'Done'
}
export const logoutSocket= async(socket)=>{
   
 return   socket.on('disconnect',async()=>{
    const {data} = await authenticationSocket({socket})
    if (!data.valid) {
     return   socket.emit('socketErrorResponse',data)
    }
    socketConnections.delete(data.user._id.toString(),socket.id)
    console.log(socketConnections);
    
    return 'Done'
    })

    
}