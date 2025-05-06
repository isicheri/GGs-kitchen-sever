import express,{ Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { port } from "./utils/secrets";
import errorMiddleware from "./middleware/error.middleware";
import indexRouter from "./routes";
import loggerMiddleware from "./middleware/logger.middleware";
import { EVIRONMENT } from "./utils/secrets";

const App:Express = express();
App.use(express.json());
App.use(cors({origin: "*",methods: ["GET","POST","PUT","DELETE"]}));
App.use(helmet());
App.use(loggerMiddleware);
App.use('/api/v1',indexRouter);
App.use(errorMiddleware);

App.get("/",(req,res,next) => {
    res.send("hello world bitch");
})

if(EVIRONMENT === "production") {
    console.log("In prod mode")
  App.listen();  
}else {
    console.log("In dev mode")
    App.listen(process.env.PORT,() => {
        console.log(`server is running on port ${port}`)
    });
}