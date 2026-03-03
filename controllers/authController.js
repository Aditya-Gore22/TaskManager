const uuid=require('uuid')
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require('dotenv').config()

const fs=require('fs').promises


//Register Controller
exports.registerUser=async(req,res)=>{
    try{
        let {name,userName,email,pass}=req.body;
        if(!name || !userName || !email)
            return res.status(200).json({status:false,message:'All fields are required.'});
        let data=await fs.readFile("./data/user.json","utf-8")
        data=JSON.parse(data)
        
        if(!pass)
        {
            pass=crypto.randomBytes(6).toString('base64').slice(0,6)
            console.log("pass",pass)
        }
        //Email Exists or not 
        const userExist=data.find(user=>user.email===email)
        if(userExist){
            return res.status(200).json({status:false,message:'Email already registered.' })
        }

        //User Name Exist or not 
        const userNameExist=data.find(user=>user.userName===userName)
        if(userNameExist){
            return res.status(200).json({status:false,message:'Username already registered.'})
        }

        
        const id=uuid.v7()
        const hashPassword=await bcrypt.hash(pass, saltRounds)
        const newUser={
            id,
            name,
            userName,
            email,
            password : hashPassword,
            createdAt:new Date().toISOString(),
            updatedAt:new Date().toISOString(),
            isActive:true,
            isDeleted:false,
            deletedAt: null
        }
        data.push(newUser)
        await fs.writeFile ("./data/user.json",JSON.stringify(data,null,2))
        // const token=generateToken.generateToken(newUser.id, newUser.email)
        // res.cookie("token",token)
        res.status(201).json({status:true,message:"User Registered successfully.", id:id})
    }
    catch(err)
    {
        res.status(500).json({sttus:false,message:"Server error", error:err.message })
    }
}


// Login Controller
exports.loginUser=async(req,res)=>{
    try{ 
        const {email,pass}=req.body;
        if( !email || !pass)
                return res.status(200).json({status:false,message:'All fields are required.'});
        let data=await fs.readFile("./data/user.json","utf-8")
        data=JSON.parse(data)
        const user = data.find(u => u.email === email);

        if (!user) {
        return res.status(200).json({status:false, message: "Invalid username or password" });
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
        return res.status(200).json({status:false, message: "Invalid username or password" });
        }
        const token = jwt.sign({ email: email, id: user.id }, process.env.JWT_KEY,{expiresIn:"1h"});
        res.cookie("token",token) 
        res.status(201).json({status:true,message:'Logged in successfully.', id:user.id, token:token})
    }
    catch(err)
    {   
        res.status(500).json({message:"Server error", error:err.message })
    }

}

exports.logoutUser=(req,res)=>{
    res.clearCookie('token')
    res.json({status:true, message:'Logged out successfully.'})
}