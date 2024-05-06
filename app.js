const express = require("express");
const morgan = require("morgan");
const User = require("./models/UserModel");
const RadType = require("./models/RadiologyTypeModel");
const Pharmacy = require("./models/PharmacyModel");
const receptionistRouter = require("./routes/receptionistRoutes");
const authRouter = require("./routes/authRoutes");
// const AppError = require('./utils/appError');
// const globalErrorHandler = require("./controllers/errorController");
// const tourRouter = require("./routes/tourRoutes");

const app = express();

// 1) MiddleWares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2) Routes
app.use("/", receptionistRouter);
app.use("/", authRouter);

// app.post("/createPharmacy", async (req, res, next) => {
//   const newPharmacy = await Pharmacy.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       pharmacy: newPharmacy,
//     },
//   });
// });

// app.post("/createRadType", async (req, res, next) => {
//   const newRadType = await RadType.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       radType: newRadType,
//     },
//   });
// });

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

module.exports = app;
