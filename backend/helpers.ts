module.exports.addMonths = (date: Date, months: number) => {
  const originalDate = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() !== originalDate) {
    date.setDate(0);
  }
  return date;
};

// function addMonths(date: Date, months: number) {
//   const originalDate = date.getDate();
//   date.setMonth(date.getMonth() + +months);
//   if (date.getDate() !== originalDate) {
//     date.setDate(0);
//   }
//   return date;
// }

// module.exports(addMonths);
