const PatientUser = require("./../models/PatientModel");
const formatPdf = require("../utils/formatPdf");
const contentDisposition = require("content-disposition");
const PDFDocument = require("pdfkit");

exports.getPatientData = async (req, res, next) => {
  patientId = req.params.id;
  let patientData = await PatientUser.findById(patientId)
    .populate("patientDoctors")
    .populate("medicines");

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
  patientData = await PatientUser.findById(patientId)
    .populate("patientDoctors")
    .populate("medicines");
  if (patientData) {
    const doc = new PDFDocument();
    const encodedName = encodeURIComponent(patientData.name);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodedName}.pdf`
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
