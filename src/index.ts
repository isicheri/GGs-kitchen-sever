import express,{ Express } from "express";
import helmet from "helmet";
import { port, SESSIONSEC,EVIRONMENT } from "./utils/secrets";
import errorMiddleware from "./middleware/error.middleware";
import indexRouter from "./routes";
import loggerMiddleware from "./middleware/logger.middleware";
import cookieParser from "cookie-parser";
import session from "express-session";
import pgSession from "connect-pg-simple";
import {Pool} from "pg";
import dotenv from "dotenv";
import flash from "connect-flash";
import path from "path";
import crypto from "crypto"

dotenv.config();

const App:Express = express();
const isProduction = EVIRONMENT === "production";
const PgSession = pgSession(session);
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, 
  },
});

App.use(cookieParser());
App.use(session({
    store: new PgSession({
    pool: pgPool,
    tableName: 'user_sessions', 
    createTableIfMissing: true
  }),
    secret: SESSIONSEC as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2
    }
}))

App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.use(express.static(path.join(process.cwd(),"public")));
App.set("view engine","ejs");
App.set("views",path.join(process.cwd(),"views"));
App.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});
App.use(
   helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        'https://cdn.jsdelivr.net', // e.g., Chart.js
        ...(isProduction ? ["'unsafe-inline'"] : ["'unsafe-inline'"]), // only allow inline in dev
      ],

      styleSrc: [
        "'self'",
        'https://fonts.googleapis.com',
        ...(isProduction ? [] : ["'unsafe-inline'"]),
      ],

      styleSrcElem: [
        "'self'",
        'https://fonts.googleapis.com',
      ],

      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com',
      ],

      connectSrc: [
        "'self'",
        ...(isProduction
          ? ['https://ggs-kitchen-sever.onrender.com'] // Replace with prod API
          : ['http://localhost:4000']),
      ],

      imgSrc: [
        "'self'",
        'data:',
        'https:',
      ],

      objectSrc: ["'none'"],

      upgradeInsecureRequests: isProduction ? [] : null, // enable HTTPS upgrade in prod only
    },
  })
);


App.use(flash())
App.use(loggerMiddleware);
App.use((req, res, next) => {
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
});
App.use('/',indexRouter);
App.get("/",(req,res,next) => {
    res.redirect("/auth/login");
})
App.use((req, res, next) => {
  console.warn(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).render('404');

});
App.use(errorMiddleware)

if(EVIRONMENT === "production") {
    const renderPort = process.env.PORT || port;
  console.log(`In prod mode. Listening on port ${renderPort}`);
  App.listen(renderPort);
}else {
    console.log("In dev mode")
    App.listen(process.env.PORT,() => {
        console.log(`server is running on port ${port}`)
    });
}

//DATABASE_URL="postgresql://GGuser:GGpassword@localhost:5432/GGdb?schema=public"
