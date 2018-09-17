<template>
  <div>
    <el-row :gutter="15" style="overflow:hidden;">
      <el-col :span="6">
        <div class="nav__container whiteBg" v-init-screen-h="125" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="nav-logo"><span class="pageIconFont icon-respool"></span></div>
          <div class="nav-content">
            <h1 class="page-portrait" id="chooseBtn">
              {{routerParams.orgName}}
              <span v-if="isAdminRole()" class="pageIconFont icon-triangle-bottom page-portrait-icon"></span>
            </h1>
            <w-dropdown
              v-if="isAdminRole()"
              @item-click="itemClickHandle"
              :itemlist="BusinessList"
              :placeholder="placeholder"
              :nodatatext="nodatatext"
              :show="showDropDown"></w-dropdown>
            <p class="page-portrait__label text-overflow__style">资源池 ：互联网资源池-移动</p>
            <div class="nav-content__detail">
              <h3>业务系统</h3>
              <div class="nav-content__basicinfo">
                总数：<span>{{businessCount.orgCounts}}</span>个
                <span class="statistics-con fr">
                  <span class="label-btn idle" style="margin-right:0.5em;">{{SwitchLoadEvaluation({status: "0"})}}{{businessCount["0"]}}</span>
                  <span class="label-btn normal" style="margin-right:0.5em;">{{SwitchLoadEvaluation({status: "1"})}}{{businessCount["1"]}}</span>
                  <span class="label-btn busy">{{SwitchLoadEvaluation({status: "2"})}}{{businessCount["2"]}}</span>
                </span>
              </div>
              <div class="applist__container">
                <w-dropdown-ext style="margin-top:1em;"
                @item-click="businessClickHandle"
                :show="true"
                :itemlist="BusinessList"
                :placeholder="placeholder1"
                :nodatatext="nodatatext1"
                :add-icon="true"
                :has-status="true"
                icon-class="pageIconFont icon-webpage"
                status-icon-type="text"
                :item-text-style="{width:'75%'}"></w-dropdown-ext>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="whiteBg" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="content-header">
            <label>{{curBusiness.name}}</label><span class="content-header-text__gray">容量状态:</span><span class="label-btn" :class="SwitchLoadEvaluation({status: curBusiness.loadEvaluationNum, isClass: true})">{{SwitchLoadEvaluation({status: curBusiness.loadEvaluationNum})}}</span>
          </div>
          <div class="current-config">
            <h3>当前配置</h3>
            <div class="flex-layout">
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">{{curBusiness.cpuCoreCount}}</p>
                CPU(个)
              </div>
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">{{curBusiness.memoryCount}}</p>
                内存(GB)
              </div>
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">{{curBusiness.storageCount}}</p>
                云存储(TB)
              </div>
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">{{curBusiness.instanceCount}}</p>
                云主机(个)
              </div>
            </div>
          </div>
          <w-title>虚拟机</w-title>
          <div class="vm-content">
            <div class="vm-content__basicinfo">
              <span class="vm-content__basicinfo-title">虚拟机总数：<span>{{curVmList.data.length}}</span>个</span>
              <span class="statistics-con">
                <span data-type="0" class="label-btn idle" @click="vmFilter($event)">{{SwitchLoadEvaluation({status: "0"})}}{{curVmList["statisticsMap"]["0"]}}</span>
                <span data-type="1" class="label-btn normal" @click="vmFilter($event)">{{SwitchLoadEvaluation({status: "1"})}}{{curVmList["statisticsMap"]["1"]}}</span>
                <span data-type="2" class="label-btn busy" @click="vmFilter($event)">{{SwitchLoadEvaluation({status: "2"})}}{{curVmList["statisticsMap"]["2"]}}</span>
                <!-- <span data-type="abnormal" class="label-btn abnormal" @click="vmFilter($event)">未知</span> -->
              </span>
            </div>
            <div class="vm-content__detail" id="resdistribution_detail_table">
              <table>
                <tr v-for="(item,index) in curVmList.data" :key="index">
                  <td>
                    <div class="device-icon"><span class="pageIconFont icon-device-server" :class="SwitchLoadEvaluation({status: item.loadStatus, isClass: true})"></span></div>
                  </td>
                  <td class="stroke-bbd">
                    {{item.name}}
                    <p>状态：<span class="text-status" :class="SwitchLoadEvaluation({status: item.loadStatus, isClass: true})">{{SwitchLoadEvaluation({status: item.loadStatus})}}</span></p>
                  </td>
                  <td class="stroke-bbd">CPU利用率(月)：<span class="text-status">{{percentNum(item.cpuRate)}}</span></td>
                  <td class="stroke-bbd">内存利用率(月)：<span class="text-status">{{percentNum(item.memoryRate)}}</span></td>
                  <td class="stroke-bbd">存储利用率(月)：<span class="text-status">{{percentNum(item.storageRate)}}</span></td>
                  <td class="stroke-bbd">当前配置：{{configSplit(item.vmConfig)}}</td>
                </tr>
                <tr v-show="!curVmList.data.length">
                  <td colspan="20" align="center">...无数据...</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
import Charts from '@/assets/js/components/chartsFun.js'
import WDropdown from '@/components/common/WDropdown.vue'
import WDropdownExt from '@/components/common/WDropdownExt.vue'
import WTitle from '@/components/common/WTitle.vue'
import NoData from '@/components/common/NoData.vue'
import API from '@/assets/js/api/api.js'
import {URLMAP} from '@/assets/js/api/api.js'
import Util from '@/assets/js/util/util.js'
import Helper from '@/assets/js/util/helper.js'
import CountUp from '@/assets/js/lib/countUp-1.9.3.js'

export default {
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-resourceSupervision',
        name: '资源监管'
      }, {
        iconClass: 'iconfont icon-resource_allocation-management',
        name: '资源分配'
      }],
      routerParams: this.$route.params,
      businessCount: {
        orgCounts: 0,
        "0": 0,
        "1": 0,
        "2": 0
      },
      BusinessList: [],
      curBusiness: { // 当前门户数据

      },
      curVmList: { // 当前虚拟机数据
        "statisticsMap": {
          "0": 0,
          "1": 0,
          "2": 0
        },
        data: [
          {
            "id": "1",
            "name": null,
            "cpuRate": 0,
            "memoryRate": 0,
            "storageRate": 0,
            "vmConfig": {
              "id": null,
              "vmId": "1",
              "vmName": null,
              "cpu": 1,
              "memory": 512,
              "storage": 10,
              "configurationStatus": 0,
              "cpuRecommend": 1,
              "memoryRecommend": 512,
              "storageRecommend": 10,
              "statisticsDate": null,
              "createdAt": null
            },
            "loadStatus": 0,
            "loadStatusCn": '低'
          }
        ]
      }, 
      curFilterVmList: [],
      // orgList: [],
      // curOrgId: this.$route.params ? this.$route.params.orgId : '',
      // curOrgName: '？',
      roleLevel: this.$store.state.userInfo.roleLevel,
      showDropDown: false,
      placeholder: '请输入资源池',
      nodatatext: '暂无数据',
      placeholder1: '请输入业务系统名称',
      nodatatext1: '没找到业务系统',
      defaultText: '台虚拟机',
      // appList: [
      //   {
      //     id: '1',
      //     name: 'xx平台',
      //     statusText: '30台虚拟机',
      //     errorClass: 'icon-triangle-top'
      //   },
      //   {
      //     id: '2',
      //     name: 'AA平台',
      //     statusText: '25台虚拟机',
      //   }
      // ],
      curServerTime: new Date()
    }
  },
  components: {
    WDropdown,
    WDropdownExt,
    WTitle,
    NoData
  },
  watch: {
    appList: function (val) {
      if (!val || val.length == 0) {
        this.clearTimerIdS()
      }
    }
  },
  created () {
  let vm = this
  API.getServerTime(vm)
    .then(function (res) {
      if (res.data && res.data.body) {
        vm.curServerTime = res.data.body.systemCurrentTimeMillis
      }
    })
    .catch(function (error) {
      console.log(error)
    })
    // API
    this.getAllBusinessList(this.routerParams)
  },
  methods: {
    // API
    getAllBusinessList({orgId, regionProviderId}) {
      const self = this
      axios.all([
        this.getResBusinessListOfOrg({orgId, regionProviderId}),
        this.getBusinessPage({orgId}),
        this.getLoadVmList()
      ])
        .then(axios.spread((busListOfOrg, busPage, vmList) => {
          if (
            busListOfOrg.status == 200 && busListOfOrg.statusText == 'OK'
            && busPage.status == 200 && busPage.statusText == 'OK'
            && vmList.status == 200 && vmList.statusText == 'OK'
            ) {
            console.log('资源池应用列表')
            console.log(busListOfOrg)
            busListOfOrg = busListOfOrg.data.body
            // 获取orgList
            this.routerParams.orgName = busListOfOrg[0].orgName
            this.businessCount.orgCounts = busListOfOrg.length
            console.log('查询业务系统列表')
            console.log(busPage)
            busPage = busPage.data.body.data
            console.log('云主机负载信息')
            console.log(vmList)
            let currVmList = vmList.data.body.data
            this.businessCount = Object.assign(this.businessCount, vmList.data.body.statisticsMap)
            let [cores, errorClass, loadEvaluationNum, loadEvaluation] = ['-', '-', '-', '-']
            this.BusinessList = busListOfOrg.map((val, i) => {
              for (let k = 0; k < busPage.length; k++) {
                if (busPage[k].businessId === val.businessId) {
                  cores = busPage[k].vmList.length
                  busPage.splice(k, 1)
                  break
                }
              }
              for (let p = 0; p < currVmList.length; p++) {
                if (currVmList[p].id === val.businessId) {
                  switch (currVmList[p].loadEvaluationNum)
                  {
                    case '0':
                      errorClass = 'idle icon-triangle-top'
                      break
                    case '1':
                      errorClass = ''
                      break
                    case '2':
                      errorClass = 'busy icon-triangle-top'
                      break 
                  }
                  loadEvaluationNum: currVmList[p].loadEvaluationNum
                  loadEvaluation: currVmList[p].loadEvaluation
                  currVmList.splice(p, 1)
                  break
                }
              }
              return {
                id: val.businessId,
                name: val.businessName,
                statusText: cores + '台虚拟机',
                cores: cores,
                errorClass: errorClass,
                loadEvaluationNum: loadEvaluationNum,
                loadEvaluation: loadEvaluation
              }
            })
            this.$nextTick(() => {
              console.log($('.vue-dropdown-ext'))
              $('.vue-dropdown-ext')
              .find('.list-module')
              .find('li')
              .first()
              .trigger('click')
            })
          }
        }))
    },
    // 资源池应用列表
    getResBusinessListOfOrg({orgId, regionProviderId}) {
      return API.getResBusinessListOfOrg(this, {
        orgId: orgId,
        regionProviderId : regionProviderId
      })
    },
    // 查询业务系统列表
    getBusinessPage({orgId}) {
      let params = {
        page: 1,
        pageSize: 9999,
        orgId: orgId
      }
      return this.$http.get(URLMAP.businessPage, {
        params: params
      })
    },
    // 云主机负载信息
    getLoadVmList(params) {
      let _params = params || {
        summaryDimension: 'business'
      }
      return this.$http.get(URLMAP.loadVmList, {
        params: _params
      })
    },
    // 查询云主机配置状态统计信息
    getResInstanceConfigStatisticst(businessId) {
      return API.getResInstanceConfigStatisticst(this, {
        id: businessId,
        statisticsBy: 'business'
      })
    },
    // 云主机容量及配置信息
    getResCapacityConfigVmList(businessId) {
      let _params = {
        businessId: '1'
      }
      return this.$http.get(URLMAP.resCapacityConfigVmList, {
        params: _params
      })
    },
    // 点击businessList列表项
    businessClickHandle: function (data, event) {
      let vm = this
      if (event.target.localName == 'li') {
        $(event.target).siblings().removeClass('active')
          .end().addClass('active')
      } else if (event.target.localName == 'span') {
        $(event.target).parent().siblings().removeClass('active')
          .end().addClass('active')
      }
      vm.curBusiness = data
      console.log(data)
      this.getResInstanceConfigStatisticst(data.id)
        .then(res => {
          //console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            vm.curBusiness = Object.assign(res, vm.curBusiness)
          }
        })
      this.getResCapacityConfigVmList(data.id)
        .then(res => {
          console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            if(!res.data.body.hasOwnProperty('data')){
              // mock 接口返回有问题
              res = {
                data: [
                  {
                    "id": "1",
                    "name": 'xxx平台',
                    "cpuRate": 1,
                    "memoryRate": 2,
                    "storageRate": 31,
                    "vmConfig": {
                      "id": null,
                      "vmId": "1",
                      "vmName": null,
                      "cpu": 1,
                      "memory": 512,
                      "storage": 10,
                      "configurationStatus": 0,
                      "cpuRecommend": 1,
                      "memoryRecommend": 512,
                      "storageRecommend": 10,
                      "statisticsDate": null,
                      "createdAt": null
                    },
                    "loadStatus": "0",
                    "loadStatusCn": '低'
                  },
                  {
                    "id": "10",
                    "name": 'aaax平台',
                    "cpuRate": 0,
                    "memoryRate": 0,
                    "storageRate": 0,
                    "vmConfig": {
                      "id": null,
                      "vmId": "10",
                      "vmName": null,
                      "cpu": 4,
                      "memory": 8192,
                      "storage": 160,
                      "configurationStatus": 0,
                      "cpuRecommend": 4,
                      "memoryRecommend": 8192,
                      "storageRecommend": 160,
                      "statisticsDate": null,
                      "createdAt": null
                    },
                    "loadStatus": "1",
                    "loadStatusCn": '中'
                  },
                  {
                    "id": "11",
                    "name": 'dfsdf平台',
                    "cpuRate": 0,
                    "memoryRate": 0,
                    "storageRate": 0,
                    "vmConfig": {
                      "id": null,
                      "vmId": "11",
                      "vmName": null,
                      "cpu": 8,
                      "memory": 16384,
                      "storage": 160,
                      "configurationStatus": 0,
                      "cpuRecommend": 8,
                      "memoryRecommend": 16384,
                      "storageRecommend": 160,
                      "statisticsDate": null,
                      "createdAt": null
                    },
                    "loadStatus": "2",
                    "loadStatusCn": '高'
                  }
                ],
                "statisticsMap": {
                  "0": 1,
                  "1": 1,
                  "2": 1
                }
              }
            } else {
              res = res.data.body
            }
            vm.curVmList = res
          }
        })
      vm.clearTimerIdS() // ?还没看懂意思
    },
    
    // 显示转换
    SwitchLoadEvaluation({status, isClass}) {
      let map = {
        "0": '空闲',
        "1": '正常',
        "2": '高负载'
      }
      if (isClass) {
        map = {
          "0": 'idle',
          "1": 'normal',
          "2": 'abnormal'
        }
        return map[status] || 'abnormal'
      }
      return map[status] || '?'
    },
    isAdminRole () {
      return this.roleLevel == 1 || this.roleLevel == 2
    },
    itemClickHandle: function (data) {
      // let vm = this
      // vm.showDropDown = false
      // vm.curOrgName = data.name
      // vm.curOrgId = data.id
      // vm.getBusinessList()
    },
    getUserOrgInfo () {
      let vm = this,
        userId = vm.$store.state.userInfo.userId

      if (vm.isAdminRole()) {
        // vm.getOrgList()
      //   API.getOrgList(vm, {page: 1, pageSize: 20, orgId: vm.curOrgId})
      //     .then(function (res) {
      //       if (res.data && res.data.body && res.data.body.data.length > 0) {
      //         let _data = res.data.body.data[0]
      //         vm.curOrgName = _data.orgName
      //         vm.curOrgId = _data.orgId
      //       }
      //     })
      //     .then(function () {
      //       vm.getBusinessList()
      //     })
      // } else {
      //   API.getUserInfo(vm, userId)
      //     .then(function (res) {
      //       if (res.data && res.data.body) {
      //         let _data = res.data.body
      //         vm.curOrgName = _data.orgName
      //         vm.curOrgId = _data.orgId
      //       }
      //     })
      //     .then(function () {
      //       vm.getBusinessList()
      //     })
      }
    },
    getBusinessList () {
      let vm = this
      vm.appList = [{
        id: '1',
        name: '2',
        statusText: '不足',
        statusClass: 'label-btn shortage'
      }]
      // vm.$nextTick(function () {
      //   console.log('nextTick')
      //   $('.vue-dropdown-ext')
      //     .find('.list-module')
      //     .find('li')
      //     .first()
      //     .trigger('click')
      // })
      // API.getBusAbnormalStatusList(vm, vm.curOrgId)
      //   .then(function (res) {
      //     if (res.data && res.data.body) {
      //       let _data = res.data.body.data
      //       vm.appList = _data.map(function (ele, index, arr) {
      //         return {
      //           id: ele.businessId,
      //           name: ele.businessName,
      //           existExceptionFlow: ele.abnormalStatus,
      //           statusText: ele.abnormalStatus ? '异常' : '',
      //           statusClass: ele.abnormalStatus ? 'label-btn abnormal' : ''
      //         }
      //       })

      //       vm.$nextTick(function () {
      //         $('.vue-dropdown-ext')
      //           .find('.list-module')
      //           .find('li')
      //           .first()
      //           .trigger('click')
      //       })
      //     }
      //   })
    },
    // 过滤curVmList
    vmFilter: function ($event) {
      let $this = $($event.target)
      let disableTypes = []
      $this.toggleClass('disabled')
      $this.parent().find('.disabled').each(function (index, ele) {
        disableTypes.push($(ele).attr('data-type'))
      })
      console.log(disableTypes);
      if (this.curFilterVmList.length == 0) {
        this.curFilterVmList = Object.assign(this.curVmList.data) // 保存初值
      }
      this.curVmList.data = this.curFilterVmList.filter(function (ele) {
        console.log(disableTypes.indexOf(ele.loadStatus));
        return disableTypes.indexOf(ele.loadStatus) == -1
      })
    },
    runStatusClass: function (val) {
      return val
    },
    runStatusText: function (val) {
      let map = {
        '1': '正常',
        'abnormal': '异常',
        '0': '空闲',
        '2': '高负载'
      }
      return map[val] ? map[val] : '未知'
    },
    percentNum: function (val) {
      if (typeof val === 'number' && !isNaN(val)) {
        return val + '%'
      }
      return '-'
    },
    configSplit: function (obj) {
      if (typeof obj === 'object') {
        return obj.cpu + 'X' + obj.memory + 'X' + obj.storage + 'TB'
      }
      return '-'
    },
    addNumAnimation (id, value) {
      let num = parseFloat(value),
        numStr = String(num)
      if (!isNaN(num)) {
        let decNumber = 0
        if (numStr.split('.')[1]) {
          decNumber = numStr.split('.')[1].length > 2 ? 2 : numStr.split('.')[1].length
        }
        let countUpObj = new CountUp(id, 0, num, decNumber, 2.5)
        countUpObj.start()
        CountUp.TimerIdsManeger.timerIdsMap[id] = countUpObj
      }
    },
    clearTimerIdS () {
      CountUp.TimerIdsManeger.clearTimerId('curExceptionFlows')
      CountUp.TimerIdsManeger.clearTimerId('curTotalFlows')
      CountUp.TimerIdsManeger.clearTimerId('monthTotalFlows')
      CountUp.TimerIdsManeger.clearTimerId('monthExceptionFlows')
      $('#curExceptionFlows').text('?')
      $('#curTotalFlows').text('?')
      $('#monthTotalFlows').text('?')
      $('#monthExceptionFlows').text('?')
    }
  },
  filters: {
    exceptionFilter: function (value) {
      if (!value && value != 0) {
        value = '?'
      }
      return value
    }
  },
  mounted: function () {
    let vm = this
    // this.getUserOrgInfo()

    $(document).on('click', ':not(.list-module li)', function (e) {
      if (e.target != $('input.search-text')[0] && e.target != $('#chooseBtn')[0]) {
        $('#chooseBtn')
          .find('.page-portrait-icon')
          .removeClass('icon-triangle-top')
          .addClass('icon-triangle-bottom')
        vm.showDropDown = false
      }
    })

    $('#chooseBtn').click(function (e) {
      e.stopPropagation()
      e.preventDefault()
      let $this = $(this),
        dropdown = $this.next('.vue-dropdown')
      vm.showDropDown = !vm.showDropDown
      $this.find('.page-portrait-icon')
        .toggleClass('icon-triangle-bottom icon-triangle-top')
    })
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/component/_var.scss';
  @import '@/assets/scss/component/_layout.scss';
  @import '@/assets/scss/element_layout_init.scss';
  $white:#fff;
  $blue:#00a0e9;
  $red:#e62b2d;
  $darkGray:#A9A9A9;
  $gray:#eee;
  $green:#3ECB77;

  .text-overflow__style {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  * /deep/ .label-btn {

    &.shortage,
    &.abnormal {
      background: $color-danger;
    }

    &.normal,
    &.enough {
      background: $green;
    }

    &.disabled {
      background: #aaa!important;
    }

    &.idle {
      background: $blue;
    }

    &.busy {
      background:#cc0000;
    }

  }

  .text-status.idle {
    color:$blue;
  }

  .text-status.normal {
    color:$green;
  }

  .text-status.abnormal{
    color:$red;
  }

  .text-status.busy {
    color:#cc0000;
  }

  .page-portrait-icon {
    color: $blue;
    font-size: 12px;
    margin-left: 0.4em;
  }

  .page-portrait__label {
    width:90%;
    margin: 0 auto;
    margin-top: 0.5em;
    text-align: center;
    color: #b8b8b8;
  }

  .nav-logo {
    padding-top:40px;
    padding-bottom:1em;
    &>span {
      display: block;
      height: 60px;
      width: 60px;
      margin: 0 auto;
      line-height: 60px;
      border-radius: 100%;
      font-size:28px;
      color: $white;
      text-align:center;
      background: $blue;
    }
  }

  .nav-content {
    position: relative;
    padding: 0 0 1em 0;
    h1 {
      margin: 0;
      text-align: center;
      font-size:16px;
      font-weight: 600;
    }
  }

  .nav-content__detail {
    margin: 0 auto;
    width: 90%;
    & > h3 {
      font-size: 14px;
      margin-top: 1em;
      margin-bottom: 0.2em;
    }
  }

  .content-header {
    label {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin-left: 8px;
      margin-top: 0.5em;
      padding: 0 0.5em;
      color: #fff;
      font-weight: normal;
      background: $blue;
    }

    span {
      margin-left: 1em;
      &.content-header-text__gray {
        color:$darkGray;
      }
    }
  }

  .current-config {
    margin:15px 20px 0 20px;
    padding: 0.5em;
    border: 1px solid #dcdcdc;
    h3 {
      font-size: 14px;
      margin: 0 0 1em 0;
    }
    .current-config__item {
      p {
        font-size: 18px;
        font-weight: 600;
        color: $blue;
      }
      text-align: center;
      padding: 0 0.5em;
    }
  }

  $iconH:60px;
  $iconW:60px;
  .device-icon {
    &>span {
      display: block;
      height: $iconH;
      width: $iconW;
      margin: 0 auto;
      line-height:$iconH;
      border-radius: 100%;
      font-size:28px;
      text-align:center;
    }

    &>span.idle {
      background:#F0F8F3;
      color: $blue;
    }

    &>span.normal {
      background:#EBF8FD;
      color: $green;
    }

    &>span.abnormal{
      background:#F9EDEC;
      color: $red;
    }

    &>span.busy {
      background:#F9EDEC;
      color: #cc0000;
    }
  }

  .vm-content {
    margin: 0 20px;
    padding-left:1em;
    .vm-content__basicinfo {
      .statistics-con {
        .label-btn {
          margin-right: 0.5em;
          font-size: 12px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .vm-content__basicinfo-title {
      margin-right: 1em;
    }

    .vm-content__detail {
      margin-top:2em;
      table {
        width: 100%;
      }
      td {
        padding: 1em 0.5em 0 0.5em ;
        vertical-align: top!important;
      }
    }
  }

  td.stroke-bbd {
    border-bottom: 1px solid #E5E5E5;
  }
</style>
