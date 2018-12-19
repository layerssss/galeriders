import moment from 'moment-timezone';

import timezone from './timezone.js';

moment.tz.setDefault(timezone);
moment.locale('zh-cn');

export default moment;
