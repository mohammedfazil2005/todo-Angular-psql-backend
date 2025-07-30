const jwt=require('jsonwebtoken')

const authentication=(req,res,next)=>{
    if(req.headers['authorization']){
        const token=req.headers['authorization'].split(' ')[1]
        try {
            const verifiedToken=jwt.verify(token,process.env.SECRETKEY)
            req.userID=verifiedToken.userID
            next()
        } catch (error) {
            res.status(500).json({message:"Token error",error})
        }
    }else{
        res.status(404).json({message:"Token Required! please login!"})
    }
}

module.exports=authentication