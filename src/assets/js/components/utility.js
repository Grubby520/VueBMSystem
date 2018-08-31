// 偏函数 工具类 判断类型
function isType (type) {
  return function (obj) {
    return toString.call(obj) == '[object ' + type + ']'
  }
}
var isString = isType('String')
var isFunction = isType('Function')
var isArray = isType('Array')

// 解析cookie
function parseCookie (cookie) {
  var cookies = {}
  if (!cookie) {
    return cookies
  }
  var list = cookie.split(';')
  for (var i = 0; i < list.length; i++) {
    var pair = list[i].split('=')
    cookies[pair[0].trim()] = pair[1]
  }
  return cookies
}

//  写cookies
function setCookie (name, value, expireTime) {
  var strsec = getsec(time)
  var exp = new Date()
  exp.setTime(exp.getTime() + strsec * 1)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

// 读取cookies
function getCookie (name) {
  var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (arr = document.cookie.match(reg)) return unescape(arr[2])
  else return null
}

// 删除cookies
function delCookie (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
}

// 处理cookie时间
function getsec (str) {
  var str1 = str.substring(1, str.length) * 1
  var str2 = str.substring(0, 1)
  if (str2 == 's') {
    return str1 * 1000
  } else if (str2 == 'h') {
    return str1 * 60 * 60 * 1000
  } else if (str2 == 'd') {
    return str1 * 24 * 60 * 60 * 1000
  }
}

// 动态生成全局唯一标志符
function guid () {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 推迟到下一次重新渲染
function requestAnimFrame () {
  window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
  function (callback) {
    return window.setTimeout(callback, 1000 / 60)
  }
}

// dateFormat(this.reportDate, 'yyyy-MM-dd')
function dateFormat (date, fmt) {
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
}

// xhr
function xhr (opts) {
  let defaultOpt = {
    url: '',
    data: {},
    type: 'get'
  }
  let options = {...opts, ...defaultOpt}
  if (options.url) {
    let xhr = XMLHttpRequest ? new XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP')
    if (options.type.toUpperCase() === 'GET') {
      let dateArr = []
      for (let k in options.data) {
        dateArr.push(k + '=' + data[k])
      }
      let url = options.url + '?' + dateArr.join('&')
      xhr.open(type, url, true)
      xhr.send()
    }
    if (options.type.toUpperCase() === 'POST') {
      xhr.open(options.type, options.url, true)
      xhr.send(options.data)
    }
    return new Promise((resolve, reject) => {
      xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 304) {
          if (options.success && options.success instanceof Function) {
            options.success.call(xhr, xhr.responseText)
          } else {
            resolve(xhr.responseText)
          }
        } else {
          if (options.error && options.error instanceof Function) {
            options.error.call(xhr, xhr.responseText)
          } else {
            reject(xhr.responseText)
          }
        }
      }
    })
  }
}

// jsonp

// fetch
async function http (type = 'GET', url = '', data = {}, method = 'fetch') {
  type = type.toUpperCase()

  if (type == 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      credentials: 'include', // 强制加入凭据头cookie
      method: type,
      headers: {
        'Accept': 'application/json', // 通过头指定，获取的数据类型是JSON
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'force-cache'
    }

    if (type == 'POST') {
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      var response = await fetch(url, requestConfig)
      var responseJson = await response.json()
    } catch (error) {
      throw new Error(error)
    }
    return responseJson
  } else {
    return new Promise((resolve, reject) => {
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else {
        requestObj = new ActiveXObject()
      }

      let sendData = ''
      if (type == 'POST') {
        sendData = JSON.stringify(data)
      }

      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      requestObj.send(sendData)

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}

// 将[]
export {
  isString,
  isArray,
  isFunction,
  requestAnimFrame,
  dateFormat,
  xhr
}
