const mogoose = require("mongoose")

const connectDB =  async ()=>{
    try {
        await mogoose.connect(process.env.DATABASE_URI)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = connectDB