import moment from 'moment';

import timezone from './timezone.js';
import getMonthRecords from './getMonthRecords.js';

const getWeekRecords = records =>
  getMonthRecords(records).filter(r =>
    moment(r.date).isSame(moment().tz(timezone), 'week')
  );

export default getWeekRecords;
