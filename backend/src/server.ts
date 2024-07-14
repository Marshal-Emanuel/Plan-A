import express, {Request ,Response} from "express"
import user_router from "./routes/user.router"
import event_router from "./routes/event.router"


const app = express()
app.use(express.json())

app.use("/user", user_router);
app.use("/event", event_router);

app.get("/", (req: Request, res: Response) =>{
    res.send("Server Plana is running")
})

app.listen(4400, ()=>{
    console.log("server is running on port 4400")
})