import dotenv from "dotenv"
import connectDb from "./db/index.js"
import { app } from "./app.js";


dotenv.config({
    path:'./env'
})



connectDb()

.then(()=>{

    app.on("error",(error)=>{
            console.log("error in listning",error)
            throw error
        })

    app.listen(process.env.PORT||7000 ,()=>{
        console.log(`server is running at port:${process.env.PORT}`);
        
    })

})
.catch((error)=>{
    console.log("mongodb connection failed !!!",error);
})
