const urls = {
  // 部门列表
  orgList: '/base/org/page',
  // 业务列表
  businessList: '/base/business/page',
  // 用户信息
  userInfo: '/base/user'
}

export {urls as BASE_URL}

export default {

  // 流量分析-获取机构列表
  getOrgList(vm, params) {
    let _params = params || {
      page: 1,
      pageSize: 100000,
      orgId: undefined
    }
    return vm.$http.get(urls.orgList, {
      params: _params
    })
  },
  // 获取用户信息
  getUserInfo(vm, userId) {
    return vm.$http.get(urls.userInfo + '/' + userId)
  }
}