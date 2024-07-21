import express, {Request ,Response} from "express"
import user_router from "./routes/user.router"
import event_router from "./routes/event.router"
import reservation_router from "./routes/reservation.router"
import auth_router from "./routes/auth.router"
import reviews_router from "./routes/reviews.router"
import systemReview_router from "./routes/systemReview.router"


const app = express()
app.use(express.json())

app.use("/user", user_router);
app.use("/event", event_router);
app.use("/reservation", reservation_router);
app.use("/auth", auth_router);
app.use("/reviews", reviews_router);
app.use("/systemReview", systemReview_router);


app.get("/", (req: Request, res: Response) =>{
    res.send("Server Plana is running")
})

app.listen(4400, ()=>{
    console.log("server is running on port 4400")
})