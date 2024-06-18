// app.post("/createClinic", (req, res, next) => {
//   clinicModel.create(req.body);
//   res.json({
//     msg: "done!",
//   });
// });

// function getRandomMedicine(medicines) {
//   // Check if medicines array is provided
//   if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
//     throw new Error("Please provide a valid array of medicines");
//   }

//   // Get a random index within the medicines array
//   const randomIndex = Math.floor(Math.random() * medicines.length);

//   // Return the medicine name at the random index
//   return medicines[randomIndex];
// }
// const medicines = [
//   "Paracetamol",
//   "Ibuprofen",
//   "Aspirin",
//   "Amoxicillin",
//   "Azithromycin",
//   "Cephalexin",
//   "Ciprofloxacin",
//   "Clarithromycin",
//   "Clindamycin",
//   "Doxycycline",
//   "Erythromycin",
//   "Levofloxacin",
//   "Metronidazole",
//   "Nitrofurantoin",
//   "Penicillin",
//   "Sulfamethoxazole",
//   "Tetracycline",
//   "Trimethoprim",
//   "Vancomycin",
//   "Zithromax",
// ];
// app.post(
//   "/createPatientUsers",
//   catchAsync(async (req, res, next) => {
//     const createdUsers = [];

//     for (let i = 0; i < req.body.length; i++) {
//       const user = req.body[i];

//       // Check if the user already exists
//       const existingUser = await PatientUser.findOne({
//         username: user.username,
//       });
//       if (existingUser) {
//         createdUsers.push({
//           status: "fail",
//           message: `User with username '${user.username}' already exists!`,
//         });
//         continue; // Skip creating this user and move to the next one
//       }

//       // Create a new patient user
//       try {
//         const clinics = require("./Test Data/clinicData");
//         function getRandomClinicId() {
//           const randomIndex = Math.floor(Math.random() * clinics.length);
//           return clinics[randomIndex]._id.$oid;
//         }
//         const newUser = await PatientUser.create({
//           name: user.name,
//           username: user.username,
//           password: user.password,
//           passwordConfirm: user.passwordConfirm,
//           contactInfo: user.contactInfo,
//           gender: user.gender,
//           dateOfBirth: user.dateOfBirth,
//           medicines: user.medicines,
//           role: "Patient", // Ensure the role is always set to "Patient"
//           clinic: new mongoose.Types.ObjectId(getRandomClinicId()), // Assign random clinic ID
//           MRN: generateMRN(),
//         });

//         createdUsers.push({
//           status: "success",
//           message: `User '${user.username}' created successfully!`,
//           data: {
//             user: newUser,
//           },
//         });
//       } catch (error) {
//         createdUsers.push({
//           status: "fail",
//           message: `Error creating user '${user.username}': ${error.message}`,
//         });
//       }
//     }

//     res.status(202).json({
//       status: "Batch operation completed",
//       data: {
//         createdUsers,
//       },
//     });
//   })
// );
