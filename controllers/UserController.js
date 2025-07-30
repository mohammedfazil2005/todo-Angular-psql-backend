const DB=require('../config/DB')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
exports.onRegisterUser=async(req,res)=>{
    const {username,email,password}=req.body
    try {

        const encryptedPassword=await bcrypt.hash(password,3)
        const {rows}= await DB.query("INSERT INTO USERS(username,email)values($1,$2) RETURNING *",[username,email])
        if(rows.length>=1){
            await DB.query("INSERT INTO PASSWORDS(userid,password)values($1,$2)",[rows[0].id,encryptedPassword])
        }
       return res.status(200).json({message:"Registration success!"})
    } catch (error) {
        if(error.code==23505){
           return res.status(409).json({message:"User already exists!"})
        }
        return res.status(500).json({message:"Server Error!",error})        
    }
}

exports.onLogin=async(req,res)=>{
   
    const {email,password}=req.body
    try {
       
        const {rows}=await DB.query("SELECT * FROM USERS JOIN PASSWORDS ON PASSWORDS.USERID=USERS.ID WHERE email=$1",[email])
        if(rows.length<=0){
          return  res.status(404).json({message:"User not found!"})
        }
        const decryptedPassword=await bcrypt.compare(password,rows[0].password)
        if(!decryptedPassword){
            return res.status(401).json({message:"Incorrect password!"})
        }
        const token=jwt.sign({userID:rows[0].id},process.env.SECRETKEY)
        return res.status(200).json({message:"Login success",token:token,username:rows[0].username})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error",error})
    }
}

exports.onTaskAdd=async(req,res)=>{
    const id=req.userID
    const {content}=req.body
    try {
        await DB.query("INSERT INTO CONTENT(userid,task) values($1,$2)",[id,content])
        res.status(200).json({message:"Task added!"})
    } catch (error) {
        res.status(500).json({message:"Server error",error})
    }
}

exports.onGetUserTasks=async(req,res)=>{
    const userID=req.userID
    try {
        const userTasks=await DB.query("SELECT TASK,STATUS,CONTENT.ID AS ID FROM CONTENT JOIN USERS ON USERS.ID=CONTENT.USERID WHERE USERS.ID=$1 ORDER BY CREATED_AT DESC",[userID])
        res.status(200).json({task:userTasks.rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server erro",error})
    }
}

exports.onDeleteTasks=async(req,res)=>{
    const {onDeleteTask}=req.query
    try {
        await DB.query("DELETE FROM CONTENT WHERE ID=$1",[onDeleteTask])
        res.status(200).json({message:"Task deleted"})
    } catch (error) {
        res.status(500).json({message:"Server Error",error})
    }
}

exports.onUpdateTasks=async(req,res)=>{
    const {task,id}=req.body
    try {
        await DB.query("UPDATE CONTENT SET TASK=$1 WHERE id=$2",[task,id])
        res.status(200).json({message:"task updated!"})
    } catch (error) {
        res.status(500).json({message:"Server error",error})
    }
}