export default {
  wait:ms => new Promise(resolve => setTimeout(resolve, ms)),
  dateFormat(date,fmt){
    var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },
  isLeapYear(year){
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
  },
  getMonthDays(year,month){
    let mapMonthDays = {
      1:31,
      2:this.isLeapYear(year)?29:28,
      3:31,
      4:30,
      5:31,
      6:30,
      7:31,
      8:31,
      9:30,
      10:31,
      11:30,
      12:31,
      length:12
    };
    
    return mapMonthDays[month];
  }
}