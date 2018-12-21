import moment from "moment-timezone";
import 'moment/locale/zh-cn'

import timezone from "./timezone.js";

moment.tz.setDefault(timezone);
moment.locale("zh-cn");

export default moment;
