module.exports.getDateWithAddedMonths = (date: Date, months: number) => {
  const originalDate = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() !== originalDate) {
    date.setDate(0);
  }
  return date;
};

module.exports.getReportSortOrder = (reportSortOrderParams: string) => {
  if (reportSortOrderParams === 'creationDate') {
    return { creationDate: -1 };
  }
  return { name: 1 };
};

module.exports.getRelSortOrder = (relSortOrderParams: string) => {
  if (relSortOrderParams === 'lastContacted') {
    return { lastContacted: -1 };
  }
  if (relSortOrderParams === 'firstContacted') {
    return { lastContacted: 1 };
  }
  return { name: 1 };
};

module.exports.REPORT_RESPONSE_FIELDS = {
  name: 1, relationships: 1, tags: 1, location: 1, creationDate: 1,
};
module.exports.RELATIOSHIP_RESPONSE_FIELDS = {
  name: 1, reports: 1, tags: 1, location: 1,
};
