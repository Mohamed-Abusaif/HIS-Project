const Medicine = require("./../../models/MedicineModel");
const Clinic = require("../../models/ClinicModel");
const ExcelJS = require("exceljs");
const fs = require("fs");
const PatientUser = require("../../models/PatientModel");

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
