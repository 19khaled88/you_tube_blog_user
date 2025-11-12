import mongoose from 'mongoose';


const connectDb = async()=>{
    try {
        mongoose.connect(process.env.MONGO_URI as string,{
            dbName:'youtubeblog'
        });

        console.log('connected to db')
    } catch (error) {
        console.log(error)
    }
}

export default connectDb