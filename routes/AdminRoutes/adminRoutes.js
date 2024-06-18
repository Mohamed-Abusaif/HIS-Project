const express = require("express");
const router = express.Router();

const adminController = require("../../controllers/AdminControllers/adminController");
const authController = require("../../controllers/authController");
const authorizeMiddleware = require("../../utils/authorize");

const medicineRoutes = require("./medicinesRoutes");
const { path } = require("pdfkit");
router.use("/medicines", medicineRoutes);

const protectAndAuthorize = (action) => [
  authController.protect,
  authorizeMiddleware.authorize(action),
];

// Define Routes
const routes = [
  //Admin Routes
  {
    path: "/getAdminData/:id",
    method: "get",
    action: adminController.getAdminData,
    authAction: "Admin",
  },
  {
    path: "/editPatient/:id",
    method: "post",
    action: [adminController.uploadPatientImages, adminController.editPatient],
    authAction: "Admin",
  },
  {
    path: "/getAllUsers",
    method: "get",
    action: adminController.getAllUsers,
    authAction: "Admin",
  },
  {
    path: "/editDoctorAvailability/:id",
    method: "post",
    action: adminController.editDoctorAvailabilityTime,
    authAction: "Admin",
  },
  {
    path: "/deleteDoctorPatient/:doctorId/:patientId",
    method: "delete",
    action: adminController.deleteDoctorPatient,
    authAction: "Admin",
  },
  {
    path: "/addDoctorPatient/:doctorId/:patientId",
    method: "post",
    action: adminController.addDoctorPatient,
    authAction: "Admin",
  },
  {
    path: "/getDoctorPatients/:id",
    method: "get",
    action: adminController.getDoctorPatient,
    authAction: "Admin",
  },
  {
    path: "/download-excel-pharmacy",
    method: "get",
    action: adminController.downloadPharmacyExcel,
    authAction: "Admin",
  },
  {
    path: "/downloadClinicPatientsExcel",
    method: "get",
    action: adminController.downloadClinicPatientsExcel,
    authAction: "Admin",
  },
  {
    path: "/generateClinicPatientsExcel",
    method: "get",
    action: adminController.generateClinicPatientsExcel,
    authAction: "Admin",
  },
  {
    path: "/generatePatientDemographicsReport",
    method: "get",
    action: adminController.generatePatientDemographicsReport,
    authAction: "Admin",
  },
];

// Register Routes
routes.forEach(({ path, method, action, authAction }) => {
  router.route(path)[method](...protectAndAuthorize(authAction), action);
});

module.exports = router;
