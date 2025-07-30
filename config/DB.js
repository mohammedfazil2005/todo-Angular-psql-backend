const {Pool}=require('pg')

const DB=new Pool({
    user:process.env.DATABASEUSERNAME,
    host:process.env.DATABASEHOST,
    port:process.env.DATABASEPORT,
    database:process.env.DATABASENAME,
    password:process.env.DATABASEPASSWORD
})

const onConnection=async()=>{
    try {
        await DB.connect()
        console.log("DB CONNECTED")
    } catch (error) {
        console.log("Error occured",error)
    }

}

onConnection()

module.exports=DB