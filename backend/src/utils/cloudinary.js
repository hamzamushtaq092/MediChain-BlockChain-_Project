import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'  // file system buildin in node 

// what strategy we are going to use is 

// we use multer to upload file to over local server then we use cloudinary to upload it to cloud on cloudinary

// here we take local path(file uploaded to local server ) and upload it to cloudinary so we required local path 


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary= async(localFilePath)=>{
    try {
        if(!localFilePath) return null

        // upload file to cloudinary
        const response = await cloudinary.uploader.upload(
            localFilePath, {
                resource_type: "auto"
            })

            //file has been uploaded successfully

           // console.log("file has been uploaded successfully on cloudinary", response.url)
            fs.unlinkSync(localFilePath)
            return response


        
    } catch (error) {
        // remove the locally saved temprary file from the server as the upload operation failed 
       fs.unlinkSync(localFilePath)//here sync is used because we want that this function will run at any cost 
        return null
        
    }
}

export {uploadOnCloudinary}
