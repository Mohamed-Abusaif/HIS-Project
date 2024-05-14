// Import required modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const generateMRN = require("./../utils/generateMRN");
const PatientUser = require("./../models/PatientModel");
const ReceptionistUser = require("./../models/ReceptionistModel");
const DoctorUser = require("./../models/DoctorModel");
const AdminUser = require("./../models/AdminModel");

// Load environment variables from config.env
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

// Function to import data from a JSON file
const importData = async (filePath, Model) => {
  try {
    // Read JSON data from file
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Insert data into MongoDB
    await Model.create(jsonData);

    console.log(`Data imported from ${path.basename(filePath)} successfully`);
  } catch (error) {
    console.error(
      `Error importing data from ${path.basename(filePath)}:`,
      error
    );
  }
};

// Import data from JSON files
const importAllData = async () => {
  await importData("PatientsData.json", PatientUser);
  await importData("ReceptionistsData.json", ReceptionistUser);
  await importData("DoctorsData.json", DoctorUser);
  await importData("AdminsData.json", AdminUser);

  // Close the database connection after importing all data
  mongoose.connection.close();
};

// Call the function to import all data
importAllData();
