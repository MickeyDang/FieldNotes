function formatDateRange(data: any) {
  const oldestYearMonth = (<string>data.oldestDate[0].creationDate).split('-').map((x) => Number(x));
  const newestYearMonth = (<string>data.newestDate[0].creationDate).split('-').map((x) => Number(x));
  const oldestYear = oldestYearMonth[0];
  const oldestMonth = oldestYearMonth[1];
  const newestYear = newestYearMonth[0];
  const newestMonth = newestYearMonth[1];

  const oldestDate = new Date(oldestYear, oldestMonth - 1);
  const oldestDateDisplay = oldestDate.toLocaleString('en-us', { month: 'short', year: 'numeric' });
  const newestDate = new Date(newestYear, newestMonth - 1);
  const newestDateDisplay = newestDate.toLocaleString('en-us', { month: 'short', year: 'numeric' });

  const monthsInRange = (newestYear - oldestYear) * 12 - oldestMonth + newestMonth;

  const dateRange = {
    oldestDateDisplay,
    newestDateDisplay,
    monthsInRange,
  };

  return dateRange;
}

async function findDateRange() {
  const res = await (await fetch('http://localhost:8000/dateRange')).json();
  console.log('actually res: ', res);
  return formatDateRange(res);
}

export default findDateRange;
