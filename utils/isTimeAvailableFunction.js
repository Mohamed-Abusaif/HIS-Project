// utils.js
const isSlotAvailable = async (Model, clinicName, date, time) => {
  const startTime = new Date(date);
  startTime.setHours(
    parseInt(time.split(":")[0]),
    parseInt(time.split(":")[1]),
    0,
    0
  );

  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);

  const conflictingAppointments = await Model.find({
    clinicName: clinicName,
    date: startTime.toISOString().split("T")[0],
    $or: [
      {
        time: {
          $gte: time,
          $lt: endTime.toISOString().split("T")[1].substr(0, 5),
        },
      },
      {
        time: {
          $lte: time,
          $gt: startTime.toISOString().split("T")[1].substr(0, 5),
        },
      },
    ],
  });

  return conflictingAppointments.length === 0;
};

module.exports = {
  isSlotAvailable,
};
