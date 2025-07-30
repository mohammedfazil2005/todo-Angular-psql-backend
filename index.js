require('dotenv').config()
const express=require('express')
const cors=require('cors')
const app=express()
const router=require("./routes/userRoute")
require('./config/DB')

app.use(cors())
app.use(express.json())
app.use("/api",router)


const PORT=3000|process.env.PORT

app.listen(PORT,()=>{
    console.log("SERVER RUNNING ON PORT 3000")
})