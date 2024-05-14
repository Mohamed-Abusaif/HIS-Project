const MedicineModel = require("../../models/MedicineModel");

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
