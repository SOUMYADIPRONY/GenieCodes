import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [50, 'Email must not more than 50 characters long'],
    },

    password:{
        type:String,
        required:true,
        select: false,
        minLength:[6, 'Password must be at least 6 characters long'],
    }

})

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

// userSchema.methods.generateJWT = function(){
//     return jwt.sign({email: this.email}, process.env.JWT_SECRET, {expiresIn: '24h'})
// }
userSchema.methods.generateJWT = function(){
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(
        { email: this.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
    );
}
userSchema.methods.clearTokens = async function() {
    if (redisClient) {
        // Clear any stored refresh tokens
        await redisClient.del(this.email);
    }
};


const User = mongoose.model('user', userSchema);

export default User;