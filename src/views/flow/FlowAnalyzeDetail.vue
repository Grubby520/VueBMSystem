<template>
  <div>
    <el-row :gutter="15" style="overflow:hidden;">
      <el-col :span="6">
        <div class="nav__container whiteBg" v-init-screen-h="125" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="nav-logo"><span class="pageIconFont icon-organization"></span></div>
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
      </el-col>
      <el-col :span="18">
        <div class="whiteBg" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="content-header">
            <label>{{curBusinessName}}</label><!--<span>网址:{{curIp}}</span>-->
          </div>
          <div class="flex-layout" style="margin: 0 20px;">
            <div class="flex-layout flex-item-row flex-space-1 content-statistic-module">
              <h1>当前流量(一小时)</h1>
              <div class="flex-layout flow-content">
                <div class="flex-space-1">
                  <div class="flow-num" id="curTotalFlows">{{curFlow.flowAll | exceptionFilter}}</div>
                  <span class="flow-text">总流量(GB)</span>
                </div>
                <div class="flex-space-1">
                  <div class="flow-num exception to-abnormal" id="curExceptionFlows">{{curFlow.flowAbnormal | exceptionFilter}}</div>
                  <span class="flow-text">异常流量(GB)</span>
                </div>
              </div>
            </div>
            <div class="flex-layout flex-item-row flex-space-1 content-statistic-module" style="margin-right:15px;">
              <h1>本月流量</h1>
              <div class="flex-layout flow-content">
                <div class="flex-space-1">
                  <div class="flow-num" id="monthTotalFlows">{{monthFlow.flowAll | exceptionFilter}}</div>
                  <span class="flow-text">总流量(GB)</span>
                </div>
                <div class="flex-space-1">
                  <div class="flow-num exception to-abnormal" id="monthExceptionFlows">{{monthFlow.flowAbnormal | exceptionFilter}}</div>
                  <span class="flow-text">异常流量(GB)</span>
                </div>
              </div>
            </div>
            <div class="flex-layout flex-item-row flex-space-2 content-statistic-module">
              <h1>日常流量高峰</h1>
              <div style="height:100px;overflow:hidden;">
                <el-scrollbar style="height:100%;" wrapStyle="overflow-x: hidden;">
                  <ul class="hisflow-analysis">
                    <li v-for="(item,index) in dailyFlowEstimate" :key="index">【{{item.extremeStart}}-{{item.extremeEnd}}】{{item.extremeDescription}}</li>
                    <li v-if="dailyFlowEstimate.length == 0">暂无数据...</li>
                  </ul>
                </el-scrollbar>
              </div>

            </div>
			   	</div>
          <el-row :gutter="15">
            <el-col :span="12">
              <div style="margin-left:20px;">
                <w-title>流量-时间分布(一个月)</w-title>
                <div v-if="hasFlowTimeDis">
                  <div class="charts" id="flowTimeDis"></div>
                </div>
                <div v-else class="charts">
                  <no-data></no-data>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="margin-right:20px;">
                <w-title>流量-地域分布(一个月)</w-title>
                <div v-if="hasFlowAreaDis">
                  <div class="charts" id="flowAreaDis"></div>
                </div>
                <div v-else class="charts">
                  <no-data></no-data>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
              <el-col :span="24">
                <div style="margin:0 20px;">
                  <w-title>流量趋势(一个月)</w-title>
                  <div v-if="hasFlowTrend">
                    <div class="charts" id="flowTrend"></div>
                  </div>
                  <div v-else class="charts">
                    <no-data></no-data>
                  </div>
                </div>
              </el-col>
          </el-row>
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

let _1H_Millisecond = 60 * 60 * 1000,
  _Day_Millisecond = 24 * _1H_Millisecond,
  _dateFormat = 'yyyy-MM-dd hh:mm:ss',
  now = new Date(),
  millisecond = now.getTime(),
  monthDays = Util.getMonthDays(now.getFullYear(), now.getMonth() == 0 ? 12 : now.getMonth()), // 获取上一月的天数
  timeStart = Util.dateFormat(new Date(now - monthDays * _Day_Millisecond), _dateFormat),
  timeEnd = Util.dateFormat(now, _dateFormat)

export default {
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-flow',
        name: '互联网流量监管'
      }, {
        iconClass: 'iconfont icon-flow_analyze-management',
        name: '流量分析'
      }],
      roleLevel: this.$store.state.userInfo.roleLevel,
      curOrgId: this.$route.params ? this.$route.params.orgId : '',
      curOrgName: '？',
      showDropDown: false,
      placeholder: '请输入单位',
      nodatatext: '暂无数据',
      placeholder1: '请输入业务系统名称',
      nodatatext1: '没找到业务系统',
      orgList: [],
      appList: [],
      curBusinessName: '？',
      curIp: '？',
      dailyFlowEstimate: [],
      hasFlowTimeDis: false,
      hasFlowAreaDis: false,
      hasFlowTrend: false,
      curFlow: {
        flowAll: '?',
        flowAbnormal: '?'
      },
      monthFlow: {
        flowAll: '?',
        flowAbnormal: '?'
      },
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
        this.dailyFlowEstimate = []
        this.hasFlowTimeDis = false,
        this.hasFlowAreaDis = false,
        this.hasFlowTrend = false,
        this.curFlow = {
          flowAll: '?',
          flowAbnormal: '?'
        }
        this.monthFlow = {
          flowAll: '?',
          flowAbnormal: '?'
        }

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
      vm.getBusPeakEstimate(data.id)
      vm.getBusFlowTimeDis(data.id)
      vm.getBusFlowAreaDis(data.id)
      vm.getFlowTrend(data.id)
      vm.getHistoryFlow(data.id)
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
      API.getBusAbnormalStatusList(vm, vm.curOrgId)
        .then(function (res) {
          if (res.data && res.data.body) {
            let _data = res.data.body.data
            vm.appList = _data.map(function (ele, index, arr) {
              return {
                id: ele.businessId,
                name: ele.businessName,
                existExceptionFlow: ele.abnormalStatus,
                statusText: ele.abnormalStatus ? '异常' : '',
                statusClass: ele.abnormalStatus ? 'label-btn abnormal' : ''
              }
            })

            vm.$nextTick(function () {
              $('.vue-dropdown-ext')
                .find('.list-module')
                .find('li')
                .first()
                .trigger('click')
            })
          }
        })
    },
    getBusPeakEstimate (businessId) {
      let vm = this
      API.getBusPeakEstimate(vm, businessId)
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.dailyFlowEstimate = res.data.body
          }
        })
    },
    getBusFlowTimeDis (businessId) {
      let vm = this
      API.getBusFlowTimeDis(vm, businessId, timeStart, timeEnd)
        .then(function (res) {
          if (res.data && res.data.body && res.data.body.length > 0) {
            vm.hasFlowTimeDis = true
            vm.$nextTick(function () {
              let _totalNum = 0,
                _data = res.data.body.map(function (ele, index) {
                  _totalNum += ele.flowAll
                  if (parseInt(ele.timeSegmenStart) < 10) {
                    ele.timeSegmenStart = '0' + ele.timeSegmenStart
                  }
                  if (parseInt(ele.timeSegmenEnd) < 10) {
                    ele.timeSegmenEnd = '0' + ele.timeSegmenEnd
                  }
                  return {
                    name: ele.timeSegmenStart + '-' + ele.timeSegmenEnd,
                    value: ele.flowAll
                  }
                })

              Charts.initPie({
                id: 'flowTimeDis',
                showLabel: true,
                labelPos: 'inner',
                formatter: function (params) {
                  return _totalNum == 0 ? Number(params.value.toFixed(2)) + '%' : Number(100 * params.value / _totalNum).toFixed(2) + '%'
                },
                legend: 'vertical',
                showLegend: true,
                silent: false,
                legendX: '80%',
                legendY: 'center',
                radius: ['40%', '70%'],
                colors: ['#2196F3', '#F7C968', '#93C62D', '#F28172'],
                data: _data,
                options: {
                  tooltip: {
                    formatter: function (params) {
                      return params.name + ': ' + params.value + ' GB'
                    }
                  },
                  series: [{
                    minAngle: 30
                  }]
                }
              })
            })
          } else {
            vm.hasFlowTimeDis = false
          }
        })
    },
    getBusFlowAreaDis (businessId) {
      let vm = this

      API.getBusFlowAreaDis(vm, businessId, timeStart, timeEnd)
        .then(function (res) {
          if (res.data && res.data.body && res.data.body.length > 0) {
            vm.hasFlowAreaDis = true
            vm.$nextTick(function () {
              let _data = res.data.body.map(function (ele, index) {
                return {
                  name: ele.areaName,
                  value: ele.flowAll
                }
              })

              Charts.initPie({
                id: 'flowAreaDis',
                data: _data,
                showLabel: true,
                showLabelLine: true,
                showLegend: true,
                legendX: '80%',
                legendY: 'center',
                labelPos: 'outside',
                formatter: '{c}GB',
                radius: ['1.5%', '70%'],
                eCenter: ['50%', '50%'],
                silent: false,
                options: {
                  series: [{
                    minAngle: 30
                  }]
                }
              })
            })
          } else {
            vm.hasFlowAreaDis = false
          }
        })
    },
    getFlowTrend (businessId) {
      let vm = this
      API.getFlowTrend(vm, {timeStart, timeEnd, businessId})
        .then(function (res) {
          if (res.data && res.data.body && res.data.body.length > 0) {
            vm.hasFlowTrend = true
            vm.$nextTick(function () {
              let _data = Helper.getEchartLineData(res.data.body, ['正常流量', '异常流量'], ['flowNormal', 'flowAbnormal'], 'date')
              Charts.initLine({
                id: 'flowTrend',
                unit: 'GB',
                data: _data,
                symbol: 'circle',
                smooth: false,
                legendIcon: 'circle',
                opacity: 0,
                options: {
                  grid: {
                    top: '5%',
                    bottom: '15%'
                  },
                  legend: {
                    bottom: '5%'
                  }
                },
                colors: ['#2196F3', '#dd0000']
              })
            })
          } else {
            vm.hasFlowTrend = false
          }
        })
    },
    getHistoryFlow (businessId) {
      let vm = this,
        _timeStart = Util.dateFormat(new Date(vm.curServerTime - _1H_Millisecond), 'yyyy-MM-dd hh:00:00'),
        _timeEnd = Util.dateFormat(new Date(vm.curServerTime), 'yyyy-MM-dd hh:00:00')

      API.getHistoryFlow(vm, {
        timeStart: _timeStart,
        timeEnd: _timeEnd,
        businessId: businessId
      })
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.curFlow.flowAll = res.data.body.businessFlowAll
            vm.curFlow.flowAbnormal = res.data.body.businessFlowAbnormal
            vm.addNumAnimation('curTotalFlows', vm.curFlow.flowAll)
            vm.addNumAnimation('curExceptionFlows', vm.curFlow.flowAbnormal)
          } else {
            vm.curFlow.flowAll = '?'
            vm.curFlow.flowAbnormal = '?'
          }
        })

      API.getHistoryFlow(vm, {
        timeStart,
        timeEnd,
        businessId
      })
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.monthFlow.flowAll = res.data.body.businessFlowAll
            vm.monthFlow.flowAbnormal = res.data.body.businessFlowAbnormal
            vm.addNumAnimation('monthTotalFlows', vm.monthFlow.flowAll)
            vm.addNumAnimation('monthExceptionFlows', vm.monthFlow.flowAbnormal)
          } else {
            vm.monthFlow.flowAll = '?'
            vm.monthFlow.flowAbnormal = '?'
          }
        })
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
      .then(function(res) {
        if (res.data && res.data.body) {
          vm.curServerTime = res.data.body.systemCurrentTimeMillis
        }
      })
      .catch(function(error) {
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
  $white:#fff;
  $blue:#00a0e9;
  $red:#e62b2d;
  $darkGray:#A9A9A9;
  $gray:#eee;

  .el-row {
    margin-left:0!important;
    margin-right:0!important;
  }

  .el-col {
    &:first-child {
      padding-left: 0!important;
    }

    &:last-child {
      padding-right: 0!important;
    }
  }

  .whiteBg {
    background: $white;
  }

  .charts {
    height: 230px;
  }

  * /deep/ .label-btn.abnormal {
    background: $color-danger;
  }

  .page-portrait-icon {
    color: $blue;
    font-size: 12px;
    margin-left: 0.4em;
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

  .applist__container {
    margin: 0 auto;
    width: 80%;
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
      color:$darkGray;
    }
  }

  .content-statistic-module {
    &:first-child {
      border-right: 0;
    }
    h1 {
      font-size: 14px;
      margin:0;
    }
    height: 110px;
    margin: 1em 0;
    padding:1em;
    border:1px solid rgb(224,224,224);
}

.flow-content {
  margin: 1em;
  .flow-num {
    font-size: 24px;
    color: $blue;
    &.exception {
      color: $red;
    }
  }

  .flow-text {
    font-size: 12px;
    color:$darkGray;
  }
}

.hisflow-analysis {
  margin-top: 0.5em;
  font-size: 12px;
  color:$darkGray;
  overflow: hidden;
}
</style>
