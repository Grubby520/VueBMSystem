<template>
  <div>
    <el-row :gutter="15" style="overflow:hidden;">
      <el-col :span="6">
        <div class="nav__container whiteBg" v-init-screen-h="125" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="nav-logo"><span class="pageIconFont icon-respool"></span></div>
          <div class="nav-content">
            <h1 class="page-portrait" id="chooseBtn">
              {{curOrgName}}
              <span v-if="isAdminRole()" class="pageIconFont icon-triangle-bottom page-portrait-icon"></span>
            </h1>
            <w-dropdown
              v-if="isAdminRole()"
              @item-click="itemClickHandle"
              :itemlist="orgList"
              :placeholder="placeholder"
              :nodatatext="nodatatext"
              :show="showDropDown"></w-dropdown>
            <p class="page-portrait__label text-overflow__style">资源池 ：互联网资源池-移动</p>
            <div class="nav-content__detail">
              <h3>业务系统</h3>
              <div class="nav-content__basicinfo">
                总数：<span>100</span>个
                <span class="statistics-con fr">
                  <span class="label-btn normal" style="margin-right:0.5em;">容量充足0</span>
                  <span class="label-btn abnormal">容量不足1</span>
                </span>
              </div>
              <div class="applist__container">
                <w-dropdown-ext style="margin-top:1em;"
                @item-click="appClickHandle"
                :show="true"
                :itemlist="appList"
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
            <label>{{curBusinessName}}</label><span class="content-header-text__gray">容量状态:</span><span class="label-btn shortage">不足</span>
          </div>
          <div class="current-config">
            <h3>当前配置</h3>
            <div class="flex-layout">
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">123123</p>
                CPU(个)
              </div>
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">123</p>
                内存(GB)
              </div>
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">123</p>
                云存储(TB)
              </div>
              <div class="flex-space-1 current-config__item">
                <p class="text-overflow__style">123</p>
                云主机(个)
              </div>
            </div>
          </div>
          <w-title>虚拟机</w-title>
          <div class="vm-content">
            <div class="vm-content__basicinfo">
              <span class="vm-content__basicinfo-title">虚拟机总数：<span>10</span>个</span>
              <span class="statistics-con">
                <span data-type="idle" class="label-btn idle" @click="vmFilter($event)">空闲1</span>
                <span data-type="normal" class="label-btn normal" @click="vmFilter($event)">正常2</span>
                <span data-type="busy" class="label-btn busy" @click="vmFilter($event)">高负载3</span>
                <span data-type="abnormal" class="label-btn abnormal" @click="vmFilter($event)">异常4</span>
              </span>
            </div>
            <div class="vm-content__detail" id="resdistribution_detail_table">
              <table>
                <tr v-for="(item,index) in instanceList" :key="index">
                  <td>
                    <div class="device-icon"><span class="pageIconFont icon-device-server" :class="runStatusClass(item.runStatus)"></span></div>
                  </td>
                  <td class="stroke-bbd">
                    {{item.vmName}}
                    <p>状态：<span class="text-status" :class="runStatusClass(item.runStatus)">{{runStatusText(item.runStatus)}}</span></p>
                  </td>
                  <td class="stroke-bbd">CPU利用率(月)：<span class="text-status" :class="runStatusClass(item.runStatus)">{{percentNum(item.cpuUseRadio)}}</span></td>
                  <td class="stroke-bbd">内存利用率(月)：<span class="text-status" :class="runStatusClass(item.runStatus)">{{percentNum(item.memorUseRadio)}}</span></td>
                  <td class="stroke-bbd">存储利用率(月)：<span class="text-status" :class="runStatusClass(item.runStatus)">{{percentNum(item.storageUseRadio)}}</span></td>
                  <td class="stroke-bbd">当前配置：{{item.conf}}</td>
                </tr>
                <tr v-show="!instanceList.length">
                  <td colspan="7" align="center">...无数据...</td>
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
import Charts from '@/assets/js/components/chartsFun.js'
import WDropdown from '@/components/common/WDropdown.vue'
import WDropdownExt from '@/components/common/WDropdownExt.vue'
import WTitle from '@/components/common/WTitle.vue'
import NoData from '@/components/common/NoData.vue'
import API from '@/assets/js/api/api.js'
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
      roleLevel: this.$store.state.userInfo.roleLevel,
      curOrgId: this.$route.params ? this.$route.params.orgId : '',
      curOrgName: '？',
      showDropDown: false,
      placeholder: '请输入资源池',
      nodatatext: '暂无数据',
      placeholder1: '请输入业务系统名称',
      nodatatext1: '没找到业务系统',
      orgList: [],
      appList: [],
      curBusinessName: '？',
      curServerTime: new Date(),
      instanceList: [
        {
          'vmUuid': '100b5b39-ff5b-4da2-b350-8acfc906a3d9',
          'vmName': 'xxx',
          'runStatus': 'normal',
          'cpuUseRadio': 0.4,
          'memorUseRadio': 0.6,
          'storageUseRadio': 0.3,
          'confCpu': 2,
          'confMemory': 2,
          'confStorage': 40,
          'confRecomCpu': 3,
          'confRecomMemory': 5,
          'confRecomStorage': 60,
          'conf': '2核×2.0G内存，40.0G存储',
          'confRecom': '3核×5.0G内存，60.0G存储'
        }
      ],
      tempInstanceList: []
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
  methods: {
    isAdminRole () {
      return this.roleLevel == 1 || this.roleLevel == 2
    },
    itemClickHandle: function (data) {
      let vm = this
      vm.showDropDown = false
      vm.curOrgName = data.name
      vm.curOrgId = data.id
      vm.getBusinessList()
    },
    appClickHandle: function (data, event) {
      let vm = this
      if (event.target.localName == 'li') {
        $(event.target).siblings().removeClass('active')
          .end().addClass('active')
      } else if (event.target.localName == 'span') {
        $(event.target).parent().siblings().removeClass('active')
          .end().addClass('active')
      }
      vm.clearTimerIdS()

      vm.curBusinessName = data.name
    },
    getOrgList () {
      let vm = this
      API.getOrgList(vm, {page: 1, pageSize: 100000})
        .then(function (res) {
          if (res.data && res.data.body) {
            let _data = res.data.body
            vm.orgList = _data.data.map(function (ele) {
              return {
                name: ele.orgName,
                id: ele.orgId
              }
            })
          }
        })
    },
    getUserOrgInfo () {
      let vm = this,
        userId = vm.$store.state.userInfo.userId

      if (vm.isAdminRole()) {
        vm.getOrgList()
        API.getOrgList(vm, {page: 1, pageSize: 20, orgId: vm.curOrgId})
          .then(function (res) {
            if (res.data && res.data.body && res.data.body.data.length > 0) {
              let _data = res.data.body.data[0]
              vm.curOrgName = _data.orgName
              vm.curOrgId = _data.orgId
            }
          })
          .then(function () {
            vm.getBusinessList()
          })
      } else {
        API.getUserInfo(vm, userId)
          .then(function (res) {
            if (res.data && res.data.body) {
              let _data = res.data.body
              vm.curOrgName = _data.orgName
              vm.curOrgId = _data.orgId
            }
          })
          .then(function () {
            vm.getBusinessList()
          })
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
      vm.$nextTick(function () {
        $('.vue-dropdown-ext')
          .find('.list-module')
          .find('li')
          .first()
          .trigger('click')
      })
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
    vmFilter: function ($event) {
      let $this = $($event.target),
        disableTypes = []

      $this.toggleClass('disabled')
      $this.parent().find('.disabled').each(function (index, ele) {
        disableTypes.push($(ele).attr('data-type'))
      })

      if (this.tempInstanceList.length == 0) {
        this.tempInstanceList = this.instanceList.concat()
      }

      this.instanceList = this.tempInstanceList.filter(function (ele) {
        return disableTypes.indexOf(ele.runStatus) == -1
      })
    },
    runStatusClass: function (val) {
      return val
    },
    runStatusText: function (val) {
      let map = {
        'normal': '正常',
        'abnormal': '异常',
        'idle': '空闲',
        'busy': '高负载'
      }
      return map[val] ? map[val] : '未知'
    },
    percentNum: function (val) {
      if (typeof val === 'number' && !isNaN(val)) {
        return 100 * val + '%'
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
  },
  mounted: function () {
    let vm = this
    this.getUserOrgInfo()

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
