import timezone from './timezone.js';
import moment from './moment.js';

const getMonthRecords = records =>
  records.filter(r =>
    moment(r.date).isSame(moment('2018-05-01').tz(timezone), 'month')
  );

export default getMonthRecords;