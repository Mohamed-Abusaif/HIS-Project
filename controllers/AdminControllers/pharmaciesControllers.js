const PharmacyModel = require("../../models/PharmacyModel");

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
