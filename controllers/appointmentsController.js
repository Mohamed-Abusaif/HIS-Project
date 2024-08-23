
const Surgery = require("./models/Surgery");
const DoctorUser = require("./models/DoctorModel");
const Appointment = require("./models/Appointment"); // Adjust the path as needed

const generateMRN = require("./utils/generateMRN");
const { isSlotAvailable } = require("./utils/isTimeAvailableFunction"); // Import the utility function

exports.createAppointment = async (req, res) => {
    const { patientName, clinicName, date, time, reason } = req.body;
  
    // Check if the slot is available
    if (await isSlotAvailable(Appointment, clinicName, date, time)) {
      // Create a new appointment
      const newAppointment = new Appointment({
        patientName,
        clinicName,
        date,
        time,
        reason,
      });
  
      try {
        await newAppointment.save();
        res
          .status(201)
          .json({
            message: "Appointment created successfully",
            appointment: newAppointment,
          });
      } catch (error) {
        res.status(500).json({ message: "Error creating appointment", error });
      }
    } else {
      res.status(400).json({ message: "The chosen time slot is not available" });
    }
}


exports.createSurgeryAppointment = async (req, res) => {
    const { patientName, clinicName, surgeryType, date, time, reason, notes } =
      req.body;
  
    // Check if the slot is available
    if (await isSlotAvailable(Surgery, clinicName, date, time)) {
      // Get the specialization based on the surgery type
      const specialization = surgeryTypeToSpecialization[surgeryType];
  
      // Find a random doctor with the appropriate specialization
      const randomDoctor = await findRandomDoctor(specialization);
  
      if (randomDoctor) {
        // Create a new surgery appointment
        const newSurgeryAppointment = new Surgery({
          patientName,
          clinicName,
          surgeryType,
          date,
          time,
          reason,
          surgeonName: randomDoctor.name,
          notes,
        });
  
        try {
          await newSurgeryAppointment.save();
          res.status(201).json({
            message: "Surgery appointment created successfully",
            appointment: newSurgeryAppointment,
            userMessage: `Your surgery appointment is confirmed with Dr. ${randomDoctor.name}.`,
          });
        } catch (error) {
          res
            .status(500)
            .json({ message: "Error creating surgery appointment", error });
        }
      } else {
        res
          .status(400)
          .json({ message: "No doctors available in the chosen department" });
      }
    } else {
      res.status(400).json({ message: "The chosen time slot is not available" });
    }
  }