// Mapping of surgery types to doctor specializations
const surgeryTypeToSpecialization = {
    "Cardiac Surgery": "Cardiology",
    "Orthopedic Surgery": "Orthopedics",
    "Plastic Surgery": "Plastic Surgery",
    "General Surgery": "General Surgery",
    "Pediatric Surgery": "Pediatrics",
    "Thoracic Surgery": "Thoracic Surgery",
    "Vascular Surgery": "Vascular Surgery",
    "Urologic Surgery": "Urology",
    "Ophthalmic Surgery": "Ophthalmology",
    "ENT Surgery": "ENT",
    "Gynecologic Surgery": "Gynecology",
    "Dental Surgery": "Dentistry",
    "Gastrointestinal Surgery": "Gastroenterology",
  };
  // Function to find a random doctor based on specialization
  const findRandomDoctor = async (specialization) => {
    const doctors = await DoctorUser.find({ specialization: specialization });
    if (doctors.length > 0) {
      const randomIndex = Math.floor(Math.random() * doctors.length);
      return doctors[randomIndex];
    }
    return null;
  };
