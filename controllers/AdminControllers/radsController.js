const RadTypeModel = require("../../models/RadiologyTypeModel");

exports.getRads = async (req, res, next) => {
  const Rads = await RadTypeModel.find();
  if (Rads) {
    res.status(201).json({
      status: "success",
      Rads,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "There is an Error Loading the Data Please Try again Later!",
    });
  }
};
exports.addRad = async (req, res, next) => {
  const newRad = await RadTypeModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      Rad: newRad,
    },
  });
};
exports.editRad = async (req, res, next) => {
  const rad = await RadTypeModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!rad) {
    res.status(404).json({
      status: "fail",
      message: "There is No rad with this ID!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        rad,
      },
    });
  }
};
exports.deleteRad = async (req, res, next) => {
  const rad = await RadTypeModel.findByIdAndDelete(req.params.id);

  if (!rad) {
    res.status(404).json({
      status: "fail",
      message: "There is No rad with this ID!",
    });
  } else {
    res.status(204).json({
      status: "success",
      message: "rad Deleted Successfully!",
    });
  }
};
