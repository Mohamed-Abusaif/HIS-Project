const AdminUser = require("./../models/AdminModel");
const DoctorUser = require("./../models/DoctorModel");
const PatientUser = require("./../models/PatientModel");
const PharmacyModel = require("./../models/PharmacyModel");
const MedicineModel = require("./../models/MedicineModel");
const Medicine = require("./../models/MedicineModel");

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
//Pharmacies Related Controllers:
exports.getPharmacies = async (req, res, next) => {
  pharmacies = await PharmacyModel.find();
  if (pharmacies) {
    res.status(201).json({
      status: "success",
      pharmacies,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "There is an Error Loading the Data Please Try again Later!",
    });
  }
};
exports.addPharmacy = async (req, res, next) => {
  const newPharmacy = await PharmacyModel.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      pharmacy: newPharmacy,
    },
  });
};
exports.editPharmacy = async (req, res, next) => {
  const pharmacy = await PharmacyModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!pharmacy) {
    res.status(404).json({
      status: "fail",
      message: "There is No Pharmacy with this ID!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        pharmacy,
      },
    });
  }
};
exports.deletePharmacy = async (req, res, next) => {
  const pharmacy = await PharmacyModel.findByIdAndDelete(req.params.id);

  if (!pharmacy) {
    res.status(404).json({
      status: "fail",
      message: "There is No Pharmacy with this ID!",
    });
  } else {
    res.status(204).json({
      status: "success",
      message: "Pharmacy Deleted Successfully!",
      data: null,
    });
  }
};
//Medicine Related Controllers:
exports.getMedicines = async (req, res, next) => {
  const medicines = await MedicineModel.find().populate("pharmacies");
  if (medicines) {
    res.status(201).json({
      status: "success",
      medicines,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "There is an Error Loading the Data Please Try again Later!",
    });
  }
};
exports.addMedicine = async (req, res, next) => {
  const newMedicine = await MedicineModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      Medicine: newMedicine,
    },
  });
};
exports.editMedicine = async (req, res, next) => {
  const medicine = await MedicineModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!medicine) {
    res.status(404).json({
      status: "fail",
      message: "There is No Medicine with this ID!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        medicine,
      },
    });
  }
};
exports.deleteMedicine = async (req, res, next) => {
  const medicine = await MedicineModel.findByIdAndDelete(req.params.id);

  if (!medicine) {
    res.status(404).json({
      status: "fail",
      message: "There is No Medicine with this ID!",
    });
  } else {
    res.status(204).json({
      status: "success",
      message: "Medicine Deleted Successfully!",
    });
  }
};
