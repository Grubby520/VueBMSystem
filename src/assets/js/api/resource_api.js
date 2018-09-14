const RESOURCE_URL = {
  // 资源概览
  // 物理资源剩余容量信息
  resCapacityPhy: '/resource/resource-capacity-physical',
  // 查询云主机配置状态统计信息（首页）
  resInstanceStatistics: '/resource/instance-statistics',
  // 查询云主机配置状态统计信息（分配详情页）
  resInstanceConfigStatisticst: '/resource/instance-config-statistics',
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
  // 资源池及对应单位和应用列表 regionProvider/list
  regionProviderList: '/base/regionProvider/list',
  // 资源池容量信息(虚拟资源容量信息)
  resCapacityVirtualList: '/resource/resource-capacity-virtual-list',
  // 资源池负载趋势信息
  resLoadTrendResPoolList: '/resource/load-trend-resource-pool-list',
  // 查询配置变更事件
  resEventDeviceChange: '/resource/event-device-change',
  // 查询负载异常事件
  resEventLoad: '/resource/event-load',
  // 资源分配
  // 查询资源池容量配置详情信息
  resCapacityConfigPool: '/resource/resource-capacity-config-pool',
  // 查询虚拟资源统计信息
  resVirtualOverview: '/resource/resource-virtual-overview',
  // 部门资源分配较多top5
  orgResFreeTop: '/resource/org-resource-free-top',
  // 查询部门资源配置分配详情
  orgResAllocateDetail: '/resource/org-resource-allocate-detail',
  // 查询云主机负载信息
  resourceLoadVmList: '/resource/load-vm-list',
  // 查询云主机负载趋势信息
  loadTrendVmList: '/resource/load-trend-vm-list',
  // 查询云主机配置状态详细信息
  resInstanceConfigDetail: '/resource/instance-config-detail',
  // 查询云主机配置仿真信息
  resInstanceConfigMock: '/resource/instance-config-mock',
  // 资源分配详情
  // 资源池应用列表
  resBusinessListOfOrg: '/base/regionProvider/getBusinessListOfOrg',
  // 查询云主机负载信息
  loadVmList: '/resource/load-vm-list'
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
  getResLoadPhyResList (vm, params) {
    let _params = params || {
      summaryDimension: 'region'
    }
    return vm.$http.get(RESOURCE_URL.resLoadPhyResList, {
      params: _params
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
  getResLoadNetAreaResPool (vm, params) {
    let _params = params || {}
    return vm.$http.get(RESOURCE_URL.resLoadNetAreaResPool, {
      params: _params
    })
  },
  // 资源容量
  getRegionProviderList (vm) {
    return vm.$http.get(RESOURCE_URL.regionProviderList)
  },
  getResCapacityVirtualList (vm) {
    return vm.$http.get(RESOURCE_URL.resCapacityVirtualList)
  },
  getResLoadTrendResPoolList (vm) {
    return vm.$http.get(RESOURCE_URL.resLoadTrendResPoolList)
  },
  // table
  getResEventDeviceChange (vm, params = {}) {
    let _params = params
    return vm.$http.get(RESOURCE_URL.resEventDeviceChange, {
      params: _params
    })
  },
  // table
  getResEventLoad (vm, params = {}) {
    return vm.$http.get(RESOURCE_URL.resEventLoad, {
      params: params
    })
  },
  getResCapacityConfigPool (vm, params) {
    // poolId? regionProviderId
    let _params = params || {}
    return vm.$http.get(RESOURCE_URL.resCapacityConfigPool, {
      params: _params
    })
  },
  getResVirtualOverview (vm, params) {
    // poolId?
    let _params = params || {}
    return vm.$http.get(RESOURCE_URL.resVirtualOverview, {
      params: _params
    })
  },
  getOrgResFreeTop (vm, params) {
    // poolId?
    let _params = params || {
      resourcePoolId: '' // 对应 regionProviderId
    }
    return vm.$http.get(RESOURCE_URL.orgResFreeTop, {
      params: _params
    })
  },
  getOrgResAllocateDetail (vm, params) {
    // resourcePoolId - regionProviderId
    let _params = params || {}
    return vm.$http.get(RESOURCE_URL.orgResAllocateDetail, {
      params: _params
    })
  },
  getResourceLoadVmList(params) {
    return this.$http.get(RESOURCE_URL.resourceLoadVmList, {
      params: params
    })
  },
  getLoadTrendVmList(params) {
    return this.$http.get(RESOURCE_URL.loadTrendVmList, {
      params: params
    })
  },
  getResInstanceConfigDetail(params) {
    return this.$http.get(RESOURCE_URL.resInstanceConfigDetail, {
      params: params
    })
  },
  // 查询云主机配置仿真信息
  getResInstanceConfigMock (params) {
    return this.$http.get(RESOURCE_URL.resInstanceConfigMock, {
      params: params
    })
  },
  getResBusinessListOfOrg (vm, params) {
    let _params = params || {
      orgId: '',
      regionProviderId : ''
    }
    return vm.$http.get(RESOURCE_URL.resBusinessListOfOrg, {
      params: _params
    })
  }
}

export {RESOURCE_URL}