const userModel = require("../models/userModel");
const { createToken } = require("../utils/generateToken");
const {hashPassword,comparePassword} = require("../utils/passwordUtilities");


const register = async (req,res)=>{
  try {
    console.log("registerd")
    const {name,email,password,confirmPassword} = req.body;

    if(!name || !email || !password || !confirmPassword){
      return res.status(400).json({error: "All fields are required"})
    }
    
    if(password !== confirmPassword){
      return res.status(400).json({error: "Password and Confirm Password do not match"})
    }
    console.log("usercheck")
    const userExists = await userModel.findOne({email})// email:req.body.email
    console.log("userexsist")
    if(userExists){
      return res.status(400).json({error: "User already exists"})
    }

    const hashedPassword = await hashPassword(password)

    const newUser = new userModel({
      name,email,password:hashedPassword
    })

    const saveduser = await newUser.save();
    if(saveduser){
      const token = createToken(saveduser._id)
      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token",token,{
        httpOnly: true,
        secure: isProduction,         
        sameSite: isProduction ? "none" : "lax",  
        maxAge: 1000 * 60 * 60 * 24,
      })
      
      return res.status(201).json({message: "User registered successfully"})
    }
    
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
}

const login = async(req,res)=>{
  try {
    const {email,password} = req.body;

    if(!email || !password){
      return res.status(400).json({error: "All fields are required"})
    }

    const userExists = await userModel.findOne({email})
    if(!userExists){
      return res.status(400).json({error: "user does not exist"})
    }

    const passwordMatch = await comparePassword(password,userExists.password)
    console.log(passwordMatch);

    if(!passwordMatch){
      return res.status(400).json({error:"password is incorrect"})
    }
      const token = createToken(userExists._id)

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token",token,{
        httpOnly: true,
        secure: isProduction,         
        sameSite: isProduction ? "none" : "lax",  
        maxAge: 1000 * 60 * 60 * 24,
      })
     
    return res.status(200).json({message: "User Login successful",userExists})

  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({message: error.message || "Internal Server Error"})
  }
}


module.exports = {
  register,
  login
}