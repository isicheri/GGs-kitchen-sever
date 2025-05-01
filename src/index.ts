import express,{ Express } from "express";
import cors from "cors";
import helmet from "helmet";

const App:Express = express();


App.listen(process.env.PORT,() => {
    console.log(`server is runnin on port ${process.env.PORT}`)
})