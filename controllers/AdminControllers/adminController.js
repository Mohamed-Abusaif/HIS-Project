const AdminUser = require("../../models/AdminModel");
const DoctorUser = require("../../models/DoctorModel");
const PatientUser = require("../../models/PatientModel");
const RadTypeModel = require("../../models/RadiologyTypeModel");
//Admin Related Controllers:
exports.getAdminData = async (req, res, next) => {
  adminId = req.params.id;
  adminUser = await AdminUser.findById(adminId);
  if (adminUser) {
    res.status(201).json({
      status: "success",
      adminUser,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message:
        "There is an Error Loading this User's Data Please Try again Later!",
    });
  }
};
