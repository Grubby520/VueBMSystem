const RESOURCE_URL = {
  // 资源概览
  // 物理资源剩余容量信息
  resCapacityPhy: '/resource/resource-capacity-physical',
  // 查询云主机配置状态统计信息（首页）
  resInstanceStatistics: '/resource/instance-statistics',
  // 查询云主机配置状态统计信息（分配详情页）
  resInstanceConfigStatisticst: '/resource/instance-config-statisticst',
  // 查询物理资源负载信息
  resLoadPhyResList: '/resource/load-physical-resource-list',
  // 物理设备容量统计信息
  resCapacityPhyOverview: '/resource/resource-capacity-physical-overview',
  // 网络区域列表
  baseRegionList: '/base/region/list',
  // 资源池剩余容量信息
  resCapacityPoolList: '/resource/resource-capacity-pool-list',
  // 网络区域资源池负载信息
  resLoadNetAreaResPool: '/resource/load-net-area-resource-pool',
  // 资源容量
  // 资源池及对应单位和应用列表
  // 资源池容量信息
  resCapacityVirtualList: '/resource/resource-capacity-virtual-list',
  // 资源池负载趋势信息
  resLoadTrendResPoolList: '/resource/load-trend-resource-pool-list',
  // 查询配置变更事件
  resConfigChangeEventList: '/resource/config-change-event-list',
  // 查询负载异常事件
  resLoadAbEventList: '/resource/load-abnormal-event-list'
}

function paramsSeri(params) {
  let queryParam = ''
  for (let key in params) {
    queryParam += key + '=' + encodeURIComponent(params[key]) + '&'
  }
  queryParam = queryParam.replace(/&$/, '')
  return queryParam
}

export default {
  // 资源概览
  getResCapacityPhy (vm) {
    return vm.$http.get(RESOURCE_URL.resCapacityPhy)
  },
  getResInstanceStatistics (vm) {
    return vm.$http.get(RESOURCE_URL.resInstanceStatistics)
  },
  getResInstanceConfigStatisticst (vm, params) {
    let _params = params || {
      id: '',
      statisticsBy: ''
    }
    return vm.$http.get(RESOURCE_URL.resInstanceConfigStatisticst, {
      params: _params
    })
  },
  getResLoadPhyResList (vm) {
    return vm.$http.get(RESOURCE_URL.resLoadPhyResList, {
      params: {
        summaryDimension: 'region'
      }
    })
  },
  getResCapacityPhyOverview (vm) {
    return vm.$http.get(RESOURCE_URL.resCapacityPhyOverview)
  },
  getBaseRegionList (vm) {
    return vm.$http.get(RESOURCE_URL.baseRegionList)
  },
  getResCapacityPoolList (vm, params) {
    let _params = params || {
      statisticsBy: 'regionType',
      timeStart: '',
      timeEnd: ''
    }
    return vm.$http.get(RESOURCE_URL.resCapacityPoolList, {
      params: _params,
      paramsSerializer: paramsSeri
    })
  },
  getResLoadNetAreaResPool (vm) {
    return vm.$http.get(RESOURCE_URL.resLoadNetAreaResPool)
  },
  // 资源容量
  getResCapacityVirtualList (vm) {
    return vm.$http.get(RESOURCE_URL.resCapacityVirtualList)
  },
  getResLoadTrendResPoolList (vm) {
    return vm.$http.get(RESOURCE_URL.resLoadTrendResPoolList)
  },
  getResConfigChangeEventList (vm, params) {
    let _params = params || {
      eventType: ''
    }
    return vm.$http.get(RESOURCE_URL.resConfigChangeEventList, {
      params: _params
    })
  },
  getResLoadAbEventList (vm) {
    return vm.$http.get(RESOURCE_URL.resLoadAbEventList)
  }
}

export {RESOURCE_URL}