const PatientUser = require("./../models/PatientModel");
const formatPdf = require("../utils/formatPdf");
const PDFDocument = require("pdfkit");

exports.getPatientData = async (req, res, next) => {
  patientId = req.params.id;
  patientData =
    await PatientUser.findById(patientId).populate("patientDoctors");
  //only show the doctor's name and specialization and his contact info here for the patient
  if (patientData) {
    res.status(200).json({
      status: "success",
      patientData,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "The User Has Been Deleted or Does Not Exist!",
    });
  }
};

exports.downloadPatientData = async (req, res, next) => {
  patientId = req.params.id;
  patientData =
    await PatientUser.findById(patientId).populate("patientDoctors");
  if (patientData) {
    const doc = new PDFDocument();
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${patientData.name}.pdf`
    );
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);
    formatPdf.formatUserDataToPDF(doc, patientData);
    doc.end();
  } else {
    res.status(404).json({
      status: "fail",
      message: "The User Has Been Deleted or Does Not Exist!",
    });
  }
};
