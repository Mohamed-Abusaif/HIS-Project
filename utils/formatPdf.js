const PDFDocument = require("pdfkit");
const fs = require("fs");
const mongoose = require("mongoose");

// Function to format PDF document
exports.formatUserDataToPDF = (doc, userData) => {
  // Load a font that supports Arabic
  doc.registerFont("Amiri", "utils/Amiri-Bold.ttf");

  // Helper function to handle Arabic text
  const formatArabicText = (label, text) => {
    return `${label}: ${text.split(" ").reverse().join(" ")}`;
  };

  // Add title
  doc
    .font("Amiri")
    .fontSize(20)
    .text("User Data", { align: "left" })
    .moveDown();

  // Add user information
  doc
    .fontSize(14)
    .text(formatArabicText("Name", userData.name), { align: "left" })
    .moveDown();
  doc
    .fontSize(14)
    .text(`Username: ${userData.username}`, { align: "left" })
    .moveDown();
  doc
    .fontSize(14)
    .text(`Contact Info: ${userData.contactInfo}`, { align: "left" })
    .moveDown();
  doc
    .fontSize(14)
    .text(`Gender: ${userData.gender}`, { align: "left" })
    .moveDown();
  doc
    .fontSize(14)
    .text(`Date of Birth: ${userData.dateOfBirth}`, { align: "left" })
    .moveDown();
  doc.fontSize(14).text(`Role: ${userData.role}`, { align: "left" }).moveDown();
  doc.fontSize(14).text(`MRN: ${userData.MRN}`, { align: "left" }).moveDown();

  // Add patient doctors
  if (userData.patientDoctors && userData.patientDoctors.length > 0) {
    doc.fontSize(14).text("Patient Doctors:", { align: "left" }).moveDown();
    userData.patientDoctors.forEach((doctor, index) => {
      doc
        .fontSize(12)
        .text(formatArabicText(`${index + 1}`, doctor.name), { align: "left" })
        .moveDown();
    });
  }

  // Add medical history
  if (userData.medicalHistory) {
    doc
      .fontSize(14)
      .text(`Medical History: ${userData.medicalHistory}`, { align: "left" })
      .moveDown();
  }

  // Add medicines
  if (userData.medicines && userData.medicines.length > 0) {
    doc.fontSize(14).text("Medicines:", { align: "left" }).moveDown();
    userData.medicines.forEach((medicine, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${medicine.name}`, { align: "left" })
        .moveDown();
    });
  }

  // Add lab results
  if (userData.labResults && userData.labResults.length > 0) {
    doc.addPage();
    doc.fontSize(14).text("Lab Results:", { align: "left" }).moveDown();
    userData.labResults.forEach((result, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${result.name}`, { align: "left" })
        .moveDown();
    });
  }

  // Add radiology results
  if (userData.radResults && userData.radResults.length > 0) {
    doc.addPage();
    doc.fontSize(14).text("Radiology Results:", { align: "left" }).moveDown();
    userData.radResults.forEach((result, index) => {
      doc
        .fontSize(12)
        .text(`${index + 1}. ${result.name}`, { align: "left" })
        .moveDown();
    });
  }
};
