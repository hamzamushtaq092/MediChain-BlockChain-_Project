import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connect_db=async()=>{
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME} `)

        
            console.log("MongoDB connected successfully",connectionInstance.connection.host)


        
    } catch (error) {
        console.log("Error in connecting to db",error)
    
        process.exit(1)
        
    }
}

export default connect_db





// const connectDB = async ()=>{

//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME} `)
//         console.log(`MongoDB Connected: ${connectionInstance.connection.host}`)
        
//     } catch (error) {
        
//     console.error('Failed to connecting to database',error)
//     process.exit(1)
//     }
    
// }

// export default connectDB
