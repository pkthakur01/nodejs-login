const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const http = require('http');
const server = http.Server(app);
const bearerToken = require('express-bearer-token');
const server_configs = require("./config/server_config.json");
const jwtconfig = require("./config/jwt_config.json");
const cookieconfig = require('./config/cookie_config.json');
const log4js = require('log4js');
const logger = log4js.getLogger('RequestedApILog');

log4js.configure({
    appenders: { Liev: { type: 'dateFile', filename: 'mylog-log.log', pattern: '.yyyy-MM-dd', compress: true } },
    categories: { default: { appenders: ['Liev'], level: 'debug' } }

});

require("./db/mongooseconnection")
const jwtToken = require('./utils/jwttoken');
const port = server_configs.port;
module.exports = server;



app.set('secret', jwtconfig.secret);
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [cookieconfig.cookieKey]
    })
)

app.use(bearerToken());

const cors = require('cors');
app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(async function (req, res, next) {
    logger.info(req.path);
    if ((req.path.match("/users/registeruser"))
        || (req.path.match("/users/loginuser"))

    ) {
       
        return next();
    }
    else {

        var token = req.token;
        jwtValue = await jwtToken.verifyJWTToken(token, app.get('secret'));

        if (!jwtValue) {
            res.status(401).send({
                status: false,
                message: 'Failed to authenticate token.'
            });
            return;
        } else {

            req.mobile = jwtValue.mobileNo;
            logger.info("User: %s", req.mobileNo);
            req.role = jwtValue.role;
            return next();
        }

    }
});

const users = require("./routes/users.js");
app.use("/users", users);

app.get("/", function (req, res) {
    console.log("app starting on port: " + port);
    res.send("Successfully Running");
});

app.listen(port, function () {
    console.log("app listening on port: " + port);
});