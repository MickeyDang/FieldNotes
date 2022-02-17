import { DateRangeProperties } from '../models/types';

const ROOT_URL = process.env.ROOT_URL ? `${process.env.REACT_APP_MAPBOX_API}` : 'http://localhost:8000';

function formatDateRange(data: any): DateRangeProperties {
  const oldestYearMonth = (<string>data.oldestDate[0].creationDate)
    .split('-').map((x) => Number(x)).slice(0, 2);
  const newestYearMonth = (<string>data.newestDate[0].creationDate)
    .split('-').map((x) => Number(x)).slice(0, 2);
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
    oldestYearMonth,
    newestYearMonth,
  };

  return dateRange;
}

async function findDateRange() {
  const res = await (await fetch(`${ROOT_URL}/dateRange`)).json();
  return formatDateRange(res);
}

export default findDateRange;
