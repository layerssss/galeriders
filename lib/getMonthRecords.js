import timezone from './timezone.js';
import moment from './moment.js';

import may from './may.js';

const getMonthRecords = records =>
  records.filter(r => moment(r.date).isSame(moment(may).tz(timezone), 'month'));

export default getMonthRecords;
