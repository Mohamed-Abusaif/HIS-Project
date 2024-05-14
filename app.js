const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const cors = require("cors");

const receptionistRouter = require("./routes/receptionistRoutes");
const adminRouter = require("./routes/AdminRoutes/adminRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const patientRouter = require("./routes/patientRoutes");

const authRouter = require("./routes/authRoutes");

const app = express();

// 1) MiddleWares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// 2) Routes
app.use("/", receptionistRouter);
app.use("/admin", adminRouter);
app.use("/", patientRouter);
app.use("/", doctorRouter);
app.use("/", authRouter);

module.exports = app;
