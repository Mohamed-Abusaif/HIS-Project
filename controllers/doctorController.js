const DoctorUser = require("./../models/DoctorModel");

exports.getDoctorData = async (req, res, next) => {
  doctorId = req.params.id;
  const doctorData =
    await DoctorUser.findById(doctorId).populate("doctorPatients");
  //only show the doctor's name and specialization and his contact info here for the patient
  if (doctorData) {
    res.status(200).json({
      status: "success",
      doctorData,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "The User Has Been Deleted or Does Not Exist!",
    });
  }
};
