import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    profilePicture: {
      type: String, // Cloudinary URL
      default: ""
    },

    refreshToken: {
      type: String,
      required:true,
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password,10)
    
})

userSchema.methods.isPasswordCorrect = async function (password) { 
    return await bcrypt.compare(password, this.password)
    
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}


export const User= mongoose.model("User",userSchema)