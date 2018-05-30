import moment from './moment.js';
import getMonthRecords from './getMonthRecords.js';

const getDayRecords = records =>
  getMonthRecords(records.filter(r => moment(r.date).isSame(moment(), 'day')));

export default getDayRecords;
