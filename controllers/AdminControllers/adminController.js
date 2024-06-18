const AdminUser = require("../../models/AdminModel");
const PatientUser = require("../../models/PatientModel");
const DoctorUser = require("./../../models/DoctorModel");
const ReceptionistUser = require("./../../models/ReceptionistModel");
const Medicine = require("./../../models/MedicineModel");
const Clinic = require("../../models/ClinicModel");

const ExcelJS = require("exceljs");
const path = require("path");
const upload = require("./../../utils/multerConfig");
const mongoose = require("mongoose");
const fs = require("fs");

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
// Middleware to handle file uploads
exports.uploadPatientImages = upload.fields([
  { name: "labResults", maxCount: 1 },
  { name: "radResults", maxCount: 1 },
]);

exports.editPatient = async (req, res, next) => {
  try {
    const userId = req.params.id;
    userObject = {
      patientDoctors: req.body.patientDoctors,
      medicines: req.body.medicines,
    };
    if (req.files && req.files.labResults) {
      userObject.labResults = req.files.labResults[0].path.replace(/\\/g, "/");
    }
    if (req.files && req.files.radResults) {
      userObject.radResults = req.files.radResults[0].path.replace(/\\/g, "/");
    }
    const patientUser = await PatientUser.findByIdAndUpdate(
      userId,
      userObject,
      {
        new: true,
        runValidators: true,
      }
    );

    if (patientUser) {
      res.status(200).json({
        status: "success",
        message: "Patient Info Updated Successfully",
        patientUser,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User Not Found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      error: err.message,
    });
  }
};

//Doctor Availability Time Routes
exports.editDoctorAvailabilityTime = async (req, res, next) => {
  const doctorId = req.params.id;
  const doctorUser =
    await DoctorUser.findById(doctorId).populate("doctorPatients");
  if (doctorUser) {
    doctorUser.doctorAvailabilityTime = req.body.doctorAvailabilityTime;
    await doctorUser.save();
    res.status(200).json({
      status: "success",
      message: "Doctor Availability Time Updated Successfully",
      doctorUser,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

//API ID return doctor's patients
exports.getDoctorPatient = async (req, res, next) => {
  const doctorId = req.params.id;
  const doctorUser =
    await DoctorUser.findById(doctorId).populate("doctorPatients");
  if (doctorUser) {
    res.status(200).json({
      status: "success",
      doctorUser,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

exports.deleteDoctorPatient = async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  const doctorUser = await DoctorUser.findById(doctorId);
  if (doctorUser) {
    const patientIndex = doctorUser.doctorPatients.indexOf(patientId);
    if (patientIndex > -1) {
      doctorUser.doctorPatients.splice(patientIndex, 1);
      await doctorUser.save();
      res.status(200).json({
        status: "success",
        message: "Patient Deleted Successfully",
        //populate the doctorUser to get the patient's data in the response
        doctorUser:
          await DoctorUser.findById(doctorId).populate("doctorPatients"),
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Patient Not Found in Doctor's List!",
      });
    }
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

exports.addDoctorPatient = async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  const doctorUser = await DoctorUser.findById(doctorId);
  if (doctorUser) {
    doctorUser.doctorPatients.push(patientId);
    await doctorUser.save();
    res.status(200).json({
      status: "success",
      message: "Patient Added Successfully",
      //populate the doctorUser to get the patient's data in the response
      doctorUser:
        await DoctorUser.findById(doctorId).populate("doctorPatients"),
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Doctor Not Found!",
    });
  }
};

//get All Users Route
exports.getAllUsers = async (req, res, next) => {
  const allUsers = {
    patientUsers: await PatientUser.find(),
    doctorUsers: await DoctorUser.find().populate("doctorPatients"),
    adminUsers: await AdminUser.find(),
    receptionistUsers: await ReceptionistUser.find(),
  };

  res.status(200).json({
    status: "success",
    allUsers,
  });
};

exports.downloadPharmacyExcel = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Medicines");

    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Description", key: "description", width: 50 },
      { header: "Pharmacies", key: "pharmacies", width: 30 },
      { header: "Availability", key: "availability", width: 15 }, // New column for availability
    ];

    medicines.forEach((medicine) => {
      const availability = medicine.quantity > 0 ? "Available" : "Un Available";
      worksheet.addRow({ ...medicine.toObject(), availability });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=medicines.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
exports.downloadClinicPatientsExcel = async (req, res) => {
  try {
    const patients = await PatientUser.find().populate("clinic");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Patients");

    worksheet.columns = [
      { header: "Patient Name", key: "name", width: 30 },
      { header: "Clinic Name", key: "clinicName", width: 30 },
      { header: "Location", key: "location", width: 30 },
      { header: "Contact Number", key: "contactNumber", width: 30 },
      { header: "Medicines", key: "medicines", width: 50 },
    ];

    patients.forEach((patient) => {
      const clinic = patient.clinic; // Access populated clinic object
      worksheet.addRow({
        name: patient.name,
        clinicName: clinic ? clinic.name : "", // Access clinic name if populated
        location: clinic ? clinic.location : "", // Access clinic location if populated
        contactNumber: clinic ? clinic.contactNumber : "", // Access clinic contact number if populated
        medicines: patient.medicines.join(", "), // Join medicines array into a string
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=patients.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating patients Excel:", error);
    res.status(500).send(error.toString());
  }
};
exports.generateClinicPatientsExcel = async (req, res) => {
  try {
    // Fetch all patients with populated clinic data
    const patients = await PatientUser.find().populate("clinic");

    // Initialize Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clinic Patients");

    // Define columns for the worksheet
    worksheet.columns = [
      { header: "Clinic Name", key: "clinicName", width: 30 },
      { header: "Patients In Clinic", key: "patientsInClinic", width: 50 },
      { header: "Number of Patients", key: "numPatients", width: 20 },
      { header: "Percentage", key: "percentage", width: 20 },
    ];

    // Track row index for adding data
    let rowIndex = 2; // Start after header row

    // Group patients by clinic ID
    const patientsByClinicId = patients.reduce((acc, patient) => {
      const clinicId = patient.clinic ? patient.clinic._id.toString() : ""; // Assuming clinic is stored as ObjectId
      if (!acc.has(clinicId)) {
        acc.set(clinicId, []);
      }
      acc.get(clinicId).push(patient);
      return acc;
    }, new Map());

    // Fetch all clinics to map clinicId to clinicName
    const clinicsMap = await Clinic.find().lean().exec(); // Assuming Clinic model is properly defined

    // Calculate total number of patients
    const totalPatients = patients.length;

    // Iterate over each clinic's patients to populate the worksheet
    for (const [clinicId, clinicPatients] of patientsByClinicId) {
      // Find clinic name
      const clinic = clinicsMap.find((c) => c._id.toString() === clinicId);
      const clinicName = clinic ? clinic.name : "Unknown Clinic";

      // Add clinic name row
      worksheet.getCell(`A${rowIndex}`).value = clinicName;
      worksheet.getCell(`A${rowIndex}`).alignment = { vertical: "middle" }; // Align vertically center

      // Add patients under the clinic name
      const patientNames = clinicPatients
        .map((patient) => patient.name)
        .join(", ");
      worksheet.getCell(`B${rowIndex}`).value = patientNames;

      // Count number of patients in clinic
      const numPatients = clinicPatients.length;
      worksheet.getCell(`C${rowIndex}`).value = numPatients;

      // Calculate percentage of patients in clinic relative to total patients
      const percentage = (numPatients / totalPatients) * 100;
      worksheet.getCell(`D${rowIndex}`).value = `${percentage.toFixed(2)}%`;

      // Increment rowIndex by 1 (for the next clinic)
      rowIndex++;
    }

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=clinic_patients.xlsx"
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating clinic patients Excel:", error);
    res.status(500).send(error.toString());
  }
};

// Function to group patients by clinic
function groupPatientsByClinic(patients) {
  const patientsByClinic = new Map();

  patients.forEach((patient) => {
    const clinicId = patient.clinic ? patient.clinic._id.toString() : ""; // Assuming clinic is stored as ObjectId
    if (patientsByClinic.has(clinicId)) {
      patientsByClinic.get(clinicId).push(patient);
    } else {
      patientsByClinic.set(clinicId, [patient]);
    }
  });

  return patientsByClinic;
}

exports.generatePatientDemographicsReport = async (req, res) => {
  try {
    // Fetch all patients
    const patients = await PatientUser.find();

    // Calculate Age Distribution
    const ageGroups = {
      "0-18": 0,
      "19-35": 0,
      "36-50": 0,
      "51+": 0,
    };

    const currentDate = new Date();
    patients.forEach((patient) => {
      const birthDate = new Date(patient.dateOfBirth);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      if (age <= 18) {
        ageGroups["0-18"]++;
      } else if (age <= 35) {
        ageGroups["19-35"]++;
      } else if (age <= 50) {
        ageGroups["36-50"]++;
      } else {
        ageGroups["51+"]++;
      }
    });

    const totalPatients = patients.length;

    // Calculate Percentage of Patients by Age Group
    const ageDistribution = {};
    for (const group in ageGroups) {
      const count = ageGroups[group];
      const percentage = (count / totalPatients) * 100;
      ageDistribution[group] = { count, percentage };
    }

    // Calculate Gender Distribution
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;

    patients.forEach((patient) => {
      if (patient.gender === "Male") {
        maleCount++;
      } else if (patient.gender === "Female") {
        femaleCount++;
      } else {
        otherCount++; // Assuming 'Other' gender category exists
      }
    });

    const genderDistribution = {
      male: { count: maleCount, percentage: (maleCount / totalPatients) * 100 },
      female: {
        count: femaleCount,
        percentage: (femaleCount / totalPatients) * 100,
      },
      other: {
        count: otherCount,
        percentage: (otherCount / totalPatients) * 100,
      },
    };

    // Generate Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheetAge = workbook.addWorksheet("Age Distribution");
    const worksheetGender = workbook.addWorksheet("Gender Distribution");

    // Age Distribution Sheet
    worksheetAge.columns = [
      { header: "Age Group", key: "ageGroup", width: 20 },
      { header: "Number of Patients", key: "count", width: 20 },
      { header: "Percentage", key: "percentage", width: 20 },
    ];

    Object.keys(ageDistribution).forEach((group, index) => {
      worksheetAge.addRow({
        ageGroup: group,
        count: ageDistribution[group].count,
        percentage: `${ageDistribution[group].percentage.toFixed(2)}%`,
      });
    });

    // Gender Distribution Sheet
    worksheetGender.columns = [
      { header: "Gender", key: "gender", width: 20 },
      { header: "Number of Patients", key: "count", width: 20 },
      { header: "Percentage", key: "percentage", width: 20 },
    ];

    Object.keys(genderDistribution).forEach((gender, index) => {
      worksheetGender.addRow({
        gender: gender,
        count: genderDistribution[gender].count,
        percentage: `${genderDistribution[gender].percentage.toFixed(2)}%`,
      });
    });

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=patient_demographics.xlsx"
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating patient demographics report:", error);
    res.status(500).send("Internal Server Error");
  }
};
