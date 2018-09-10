let urls = {
  // 历史流量接口url
  historyFlow: '/flow/flow-history',
  // 历史ip数量统计接口
  ipCountHistory: '/flow/ip-count-history',
  // 异常部门数量统计接口
  orgAbnormalCount: '/flow/org-abnormal-count',
  // 异常业务数量统计接口
  businessAbnormalCount: '/flow/business-abnormal-count',
  // 流量单位分布接口
  flowDisOrg: '/flow/flow-distribution-org',
  // 流量应用分布接口
  flowDisBusiness: '/flow/flow-distribution-business',
  // 流量趋势接口
  flowTrend: '/flow/flow-trend',
  // 告警汇总接口
  alarmSum: '/flow/alarm-sum',
  // 告警列表
  alarmList: '/flow/alarm-list',
  // 获取当前服务器时间
  serverTime: '/base/common/getSystemCurrentTime',

  // 获取应用虚拟机信息
  vmListByBusinessId: '/base/vm/getVmListByBusinessId',
  // 部门业务流量列表接口
  orgFlowList: '/flow/org-business-statistics-list',
  // 流量top5接口
  topList: '/flow/top',
  // 业务异常状态列表接口
  busAbnormalStatusList: '/flow/business-abnormal-status-list',
  // 业务流量峰值预测接口
  busPeakEstimate: '/flow/business-peak-estimate',
  // 业务流量时间分布
  busFlowTimeDis: '/flow/business-flow-time-distribution',
  // 业务流量地域分布
  busFlowAreaDis: '/flow/business-flow-area-distribution',
  flowReport: '/flow/report',
  flowAlarmRawData: '/flow/alarm-raw-data',
  flowAlarmList: '/flow/alarm-list',
  flowAlarmMarkNormal: '/flow/alarm-mark-normal'
}

function paramsSeri(params) {
  let queryParam = ''
  for (let key in params) {
    queryParam += key + '=' + encodeURIComponent(params[key]) + '&'
  }
  queryParam = queryParam.replace(/&$/, '')
  return queryParam
}
export {urls as FLOW_URL}
export default {
  // 通用-获取服务端当前时间
  getServerTime(vm) {
    return vm.$http.get(urls.serverTime)
  },
  // 流量概览-历史流量接口
  getHistoryFlow(vm, params) {
    let _params = params || {
      timeStart: '',
      timeEnd: '',
      businessId: undefined
    }

    return vm.$http.get(urls.historyFlow, {
      params: _params,
      paramsSerializer: paramsSeri
    })
  },
  // 流量概览-流量分布访问用户统计
  getUsersStatic(vm, timeStart = '', timeEnd = '') {
    return vm.$http.get(urls.ipCountHistory, {
      params: {
        timeStart: timeStart,
        timeEnd: timeEnd
      },
      paramsSerializer: paramsSeri
    })
  },
  // 流量概览-异常流量单位
  getAbnormalOrgCount(vm, timeStart = '', timeEnd = '') {
    return vm.$http.get(urls.orgAbnormalCount, {
      params: {
        timeStart: timeStart,
        timeEnd: timeEnd
      },
      paramsSerializer: paramsSeri
    })
  },
  // 流量概览-异常流量业务系统
  getAbnormalBusinessCount(vm, timeStart = '', timeEnd = '') {
    return vm.$http.get(urls.businessAbnormalCount, {
      params: {
        timeStart: timeStart,
        timeEnd: timeEnd
      },
      paramsSerializer: paramsSeri
    })
  },
  // 流量概览-流量单位分布
  getFlowDisOrg(vm, timeStart = '', timeEnd = '') {
    return vm.$http.get(urls.flowDisOrg, {
      params: {
        timeStart: timeStart,
        timeEnd: timeEnd
      },
      paramsSerializer: paramsSeri
    })
  },
  // 流量概览-流量应用分布
  getFlowDisBusiness(vm, timeStart = '', timeEnd = '') {
    return vm.$http.get(urls.flowDisBusiness, {
      params: {
        timeStart: timeStart,
        timeEnd: timeEnd
      },
      paramsSerializer: paramsSeri
    })
  },
  // 流量概览-流量趋势
  getFlowTrend(vm, params) {
    let _params = params || {
      timeStart: '',
      timeEnd: '',
      businessId: undefined
    }

    return vm.$http.get(urls.flowTrend, {
      params: _params,
      paramsSerializer: paramsSeri
    })
  },
  // 流量概览-告警汇总
  getAlarmSum(vm) {
    return vm.$http.get(urls.alarmSum)
  },
  // 流量概览-告警列表
  getAlarmList(vm, params) {
    let _params = params || {
      page: 1,
      pageSize: 20,
      businessId: undefined,
      levelCode: undefined,
      timeStart: undefined,
      timeEnd: undefined
    }
    return vm.$http.get(urls.alarmList, {
      params: _params
    })
  },
  // 流量分析-获取机构列表
  getOrgFlowList(vm, params) {
    let _params = params || {
      page: 1,
      pageSize: 20,
      orgId: undefined,
      timeStart: undefined,
      timeEnd: undefined
    }
    if (_params.orgId == null) {
      _params.orgId = ''
    }
    return vm.$http.get(urls.orgFlowList, {
      params: _params,
      paramsSerializer: paramsSeri
    })
  },
  // 流量分析-总流量top5数据
  getFlowTop5(vm, flowType, dimension, size) {
    return vm.$http.post(urls.topList, {
      flowType,
      dimension,
      size
    })
  },
  // 流量分析详情-业务系统列表
  getBusAbnormalStatusList(vm, orgId, page = 1, pageSize = 100000) {
    return vm.$http.get(urls.busAbnormalStatusList, {
      params: {
        page,
        pageSize,
        orgId
      }
    })
  },

  // 流量分析-业务流量峰值预测
  getBusPeakEstimate(vm, businessId, estimateType = 0) {
    return vm.$http.get(urls.busPeakEstimate, {
      params: {
        businessId,
        estimateType
      }
    })
  },
  // 流量分析-业务流量时间分布
  getBusFlowTimeDis(vm, businessId, timeStart, timeEnd, timeSegment = '6,12,18,24') {
    return vm.$http.get(urls.busFlowTimeDis, {
      params: {
        businessId,
        timeStart,
        timeEnd,
        timeSegment
      },
      paramsSerializer: paramsSeri
    })
  },
  // 流量分析-业务流量地域分布
  getBusFlowAreaDis(vm, businessId, timeStart, timeEnd) {
    return vm.$http.get(urls.busFlowAreaDis, {
      params: {
        businessId,
        timeStart,
        timeEnd
      },
      paramsSerializer: paramsSeri
    })
  },
  // 获取应用系统的虚拟机信息
  getVmListByBusinessId(vm, businessId) {
    return vm.$http.get(urls.vmListByBusinessId, {
      params: {
        businessId
      }
    })
  }

}