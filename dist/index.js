"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const secrets_1 = require("./utils/secrets");
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const routes_1 = __importDefault(require("./routes"));
const logger_middleware_1 = __importDefault(require("./middleware/logger.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const path_1 = __importDefault(require("path"));
const App = (0, express_1.default)();
const isProduction = secrets_1.EVIRONMENT === "production";
App.use((0, cookie_parser_1.default)());
App.use((0, express_session_1.default)({
    secret: secrets_1.SESSIONSEC,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2
    }
}));
App.use(express_1.default.json());
App.use(express_1.default.urlencoded({ extended: false }));
App.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
App.set("view engine", "ejs");
App.set("views", path_1.default.join(process.cwd(), "views"));
App.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            'https://cdn.jsdelivr.net', // e.g., Chart.js
            ...(isProduction ? [] : ["'unsafe-inline'"]), // only allow inline in dev
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
                ? ['https://your-api.com'] // Replace with prod API
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
}));
App.use((0, connect_flash_1.default)());
App.use(logger_middleware_1.default);
App.use((req, res, next) => {
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("error");
    next();
});
App.use('/', routes_1.default);
App.get("/", (req, res, next) => {
    res.redirect("/auth/login");
});
App.use((req, res, next) => {
    console.warn(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).render('404');
});
App.use(error_middleware_1.default);
if (secrets_1.EVIRONMENT === "production") {
    console.log("In prod mode");
    App.listen();
}
else {
    console.log("In dev mode");
    App.listen(process.env.PORT, () => {
        console.log(`server is running on port ${secrets_1.port}`);
    });
}
//DATABASE_URL="postgresql://GGuser:GGpassword@localhost:5432/GGdb?schema=public"
