import moment from 'moment';

import timezone from './timezone.js';

const getDayRecords = records =>
  records.filter(r => moment(r.date).isSame(moment().tz(timezone), 'day'));

export default getDayRecords;
