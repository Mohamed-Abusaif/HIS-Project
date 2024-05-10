const PDFDocument = require("pdfkit");
const fs = require("fs");
const mongoose = require("mongoose");
// Function to format PDF document
exports.formatUserDataToPDF = (doc, userData) => {
  // Add title
  doc.fontSize(20).text("User Data", { align: "center" }).moveDown();

  // Add user information
  doc.fontSize(14).text(`Name: ${userData.name}`).moveDown();
  doc.fontSize(14).text(`Username: ${userData.username}`).moveDown();
  doc.fontSize(14).text(`Contact Info: ${userData.contactInfo}`).moveDown();
  doc.fontSize(14).text(`Gender: ${userData.gender}`).moveDown();
  doc.fontSize(14).text(`Date of Birth: ${userData.dateOfBirth}`).moveDown();
  doc.fontSize(14).text(`Role: ${userData.role}`).moveDown();
  doc.fontSize(14).text(`MRN: ${userData.MRN}`).moveDown();

  // Add patient doctors
  if (userData.patientDoctors && userData.patientDoctors.length > 0) {
    doc.fontSize(14).text("Patient Doctors:").moveDown();
    userData.patientDoctors.forEach((doctor, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${doctor.name}`)
        .moveDown();
    });
  }

  // Add medical history
  if (userData.medicalHistory) {
    doc
      .fontSize(14)
      .text(`Medical History: ${userData.medicalHistory}`)
      .moveDown();
  }

  // Add medicines
  if (userData.medicines && userData.medicines.length > 0) {
    doc.fontSize(14).text("Medicines:").moveDown();
    userData.medicines.forEach((medicine, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${medicine.name}`)
        .moveDown();
    });
  }

  // Add lab results
  if (userData.labResults && userData.labResults.length > 0) {
    doc.fontSize(14).text("Lab Results:").moveDown();
    userData.labResults.forEach((result, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${result.name}`)
        .moveDown();
    });
  }

  // Add radiology results
  if (userData.radResults && userData.radResults.length > 0) {
    doc.fontSize(14).text("Radiology Results:").moveDown();
    userData.radResults.forEach((result, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${result.name}`)
        .moveDown();
    });
  }
};
