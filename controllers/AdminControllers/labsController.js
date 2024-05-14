const LabTypeModel = require("../../models/LabTypeModel");

exports.getLabs = async (req, res, next) => {
  const labs = await LabTypeModel.find();
  if (labs) {
    res.status(201).json({
      status: "success",
      labs,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "There is an Error Loading the Data Please Try again Later!",
    });
  }
};
exports.addLab = async (req, res, next) => {
  const newLab = await LabTypeModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      Lab: newLab,
    },
  });
};
exports.editLab = async (req, res, next) => {
  const lab = await LabTypeModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!lab) {
    res.status(404).json({
      status: "fail",
      message: "There is No lab with this ID!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        lab,
      },
    });
  }
};
exports.deleteLab = async (req, res, next) => {
  const lab = await LabTypeModel.findByIdAndDelete(req.params.id);

  if (!lab) {
    res.status(404).json({
      status: "fail",
      message: "There is No lab with this ID!",
    });
  } else {
    res.status(204).json({
      status: "success",
      message: "lab Deleted Successfully!",
    });
  }
};
