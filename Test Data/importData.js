const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const generateMRN = require("./../utils/generateMRN");
const PatientUser = require("./../models/PatientModel");

dotenv.config({ path: "./../config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("DB connection Done!");
  })
  .catch();

const importData = async (filePath, Model) => {
  try {
    // Read JSON data from file
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Generate MRNs and passwords for each patient
    const patients = jsonData.map((patient) => ({
      ...patient,
      MRN: generateMRN().toString(), // Generate MRN as a string
      password: "GeneratedPassword", // Replace with your password generation logic
      passwordConfirm: "GeneratedPassword", // Ensure passwordConfirm matches password
    }));

    // Insert data into MongoDB
    await Model.create(patients);

    console.log(`Data imported from ${path.basename(filePath)} successfully`);
  } catch (error) {
    console.error(
      `Error importing data from ${path.basename(filePath)}:`,
      error
    );
  }
};

// Call the function to import data
importData("PatientsData.json", PatientUser);
