import express,{ Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { port } from "./utils/secrets";
import errorMiddleware from "./middleware/error.middleware";
import indexRouter from "./routes";
import loggerMiddleware from "./middleware/logger.middleware";

const App:Express = express();
App.use(express.json());
App.use(cors());
App.use(helmet());
App.use('/api/v1',indexRouter);
App.use(loggerMiddleware);




App.use(errorMiddleware);
App.listen(process.env.PORT,() => {
    console.log(`server is running on port ${port}`)
});