const express = require("express");
const cors = require("cors");
const JSend = require("./jsend");

const session = require("express-session");
const cookieParser = require("cookie-parser");

const workoutsRouter = require("./routes/workouts.router");
const mealsRouter = require("./routes/meals.router");
const blogRouter = require("./routes/blog.router");
const authRouter = require("./routes/auth.router");

const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
const { specs, swaggerUi } = require("./docs/swagger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secretKeyForSession",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, //(1 ngày)
    },
  })
);

// app.get("/", (req, res) => {
//   return res.json(JSend.success());
// });
// app.get("/", (req, res) => {
//   if (req.session.views) {
//     req.session.views++;
//     res.json(
//       JSend.success({ message: `Bạn đã truy cập ${req.session.views} lần` })
//     );
//   } else {
//     req.session.views = 1;
//     res.json(
//       JSend.success({ message: "Chào mừng bạn đến với trang đầu tiên!" })
//     );
//   }
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/public/", express.static("./public/"));

mealsRouter.setup(app);
workoutsRouter.setup(app);
blogRouter.setup(app);
authRouter.setup(app);

app.use(resourceNotFound);

app.use(handleError);

module.exports = app;
