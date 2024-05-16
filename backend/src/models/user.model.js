import mongoose , {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true
            
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
        
        },
        fullName:{
            type:String,
            required:true,
            index:true,
            trim:true
        },
        avatar:{
            type:String,  //cloudinary url
            

        },
        role: {
            type: String,
            enum: ['patient', 'doctor', 'pharmacy'],
            required: true
        },
        password:{
            type:String,
            required:[true,'Password is required'],  // in this way you can give custom error message
        },

        dob: {
            type: Date
        },
        gender: {
            type: String,
           
        },
        blood_type: String,
        allergies: [String],
        medical_history: [
            {
                date: {
                    type: Date, // Date of the entry
                    required: true
                },
                description: {
                    type: String, // Description of the medical event or report
                    required: true
                },
                test_results: {
                    type: String // Additional field for test results
                },
                doctor_notes: {
                    type: String // Additional field for doctor's notes
                },
                reports: [
                    {
                        filename: String, // Filename
                        path: String // File path or URL
                    }
                ],
                // Additional fields as needed
            }
        ],
        last_vist: Date,


        refreshToken:{
            type:String,
        }


    },
    {
        timestamps:true
    }
    
)
// pre hook in mongooseAggregatePaginate is used to add functionality just before save 
//like here we are going to bycrypt the password before saving it to the database
userSchema.pre("save",async function(next){
    if(this.isModified('password')){  //is modified is used to check if the password is modified its a built in function
        this.password=await bcrypt.hash(this.password,10)
        next();
    }
    return next()
})

//custom function 
userSchema.methods.isPasswordCorrect=async function(password){
    // built in function of bcrypt to compare the password  it takes 2 arguments (password,encrypted password)
    return await bcrypt.compare(password,this.password)  //here this.password is the encrypted password
}

userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
                        _id:this._id,
                        username:this.username,
                        fullName:this.fullName,
                        email:this.email
                    
                    },process.env.ACCESS_TOKEN_SECRET,{
                        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
                    }
                )
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id,
     
    },process.env.REFERSH_TOKEN_SECRET,{
        expiresIn:process.env.REFERSH_TOKEN_EXPIRY
    }
)
}

export const User=mongoose.model('User',userSchema)