import moment from 'moment';

import timezone from './timezone.js';

const getWeekRecords = records =>
  records.filter(r => moment(r.date).isSame(moment().tz(timezone), 'week'));

export default getWeekRecords;
