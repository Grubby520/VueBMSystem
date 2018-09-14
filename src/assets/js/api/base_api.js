const urls = {
  // 部门列表
  orgList: '/base/org/page',
  // 业务列表
  businessList: '/base/business/page',
  // 用户信息
  userInfo: '/base/user',
  // 獲取用户详细信息
  userInfoByToken: '/base/user/loginUserInfo',
  // 查询工单云主机列表
  specification: '/base/vm/specification',

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
  // 获取业务列表
  getBusinessList(params) {
    return this.$http.get(urls.businessList, {
      params: params
    })
  },
  // 获取用户信息
  getUserInfo(vm, userId) {
    return vm.$http.get(urls.userInfo + '/' + userId)
  },
  // 获取用户信息 token
  getUserInfoByToken(params) {
    return this.$http.get(urls.userInfoByToken)
  },
  // 查询云主机列表
  getSpecification(){
    return this.$http.get(urls.specification)
  },

}