<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="12">
        <w-row>
          <template slot="title">当前流量(一小时)</template>
          <div slot="content">
            <div class="whiteBg">
              <div class="flex-layout">
                <div class="statistics-module flex-layout flex-space-1">
                  <div class="flex-layout flex-space-1 flex-content-center bg-blue ft-color-white">
                    <span class="pageIconFont icon-orther"></span>
                  </div>
                  <div class="flex-layout flex-space-3 bg-lightBlue ft-color-white">
                    <div class="flex-layout flex-space-1">
                      <span class="statistics-topic">业务访问</span>
                    </div>
                    <div class="flex-layout flex-item-row flex-space-2">
                      <div class="statistics-content">总流量<span class="statistics-num" v-num-animation="currentFlow.businessFlowAll">{{currentFlow.businessFlowAll | exceptionFilter}}</span>GB</div>
                      <div class="statistics-content to-abnormal">异常流量<span class="statistics-num" v-num-animation="currentFlow.businessFlowAbnormal">{{currentFlow.businessFlowAbnormal | exceptionFilter}}</span>GB</div>
                    </div>
                  </div>
                </div>
                <div class="statistics-module flex-layout flex-space-1">
                  <div class="flex-layout flex-space-1 flex-content-center bg-purple ft-color-white">
                    <span class="pageIconFont icon-access"></span>
                  </div>
                  <div class="flex-layout flex-space-3 bg-lightPurple ft-color-white">
                    <div class="flex-layout flex-space-1">
                      <span class="statistics-topic">其他</span>
                    </div>
                    <div class="flex-layout flex-item-row flex-space-2">
                      <div class="statistics-content">总流量<span class="statistics-num" v-num-animation="currentFlow.otherFlowAll">{{currentFlow.otherFlowAll | exceptionFilter}}</span>GB</div>
                      <div class="statistics-content to-abnormal">异常流量<span class="statistics-num" v-num-animation="currentFlow.otherFlowAbnormal">{{currentFlow.otherFlowAbnormal | exceptionFilter}}</span>GB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </w-row>

      </el-col>
      <el-col :span="12">
        <w-row>
          <template slot="title">历史流量(一个月)</template>
          <div slot="content">
            <div class="whiteBg">
              <div class="flex-layout">
                <div class="statistics-module flex-layout flex-space-1">
                  <div class="flex-layout flex-space-1 flex-content-center bg-blue ft-color-white">
                    <span class="pageIconFont icon-orther"></span>
                  </div>
                  <div class="flex-layout flex-space-3 bg-lightBlue ft-color-white">
                    <div class="flex-layout flex-space-1">
                      <span class="statistics-topic">业务访问</span>
                    </div>
                    <div class="flex-layout flex-item-row flex-space-2">
                      <div class="statistics-content">总流量<span class="statistics-num" v-num-animation="historyFlow.businessFlowAll">{{historyFlow.businessFlowAll | exceptionFilter}}</span>GB</div>
                      <div class="statistics-content to-abnormal">异常流量<span class="statistics-num" v-num-animation="historyFlow.businessFlowAbnormal">{{historyFlow.businessFlowAbnormal | exceptionFilter}}</span>GB</div>
                    </div>
                  </div>
                </div>
                <div class="statistics-module flex-layout flex-space-1">
                  <div class="flex-layout flex-space-1 flex-content-center bg-purple ft-color-white">
                    <span class="pageIconFont icon-access"></span>
                  </div>
                  <div class="flex-layout flex-space-3 bg-lightPurple ft-color-white">
                    <div class="flex-layout flex-space-1">
                      <span class="statistics-topic">其他</span>
                    </div>
                    <div class="flex-layout flex-item-row flex-space-2">
                      <div class="statistics-content">总流量<span class="statistics-num" v-num-animation="historyFlow.otherFlowAll">{{historyFlow.otherFlowAll | exceptionFilter}}</span>GB</div>
                      <div class="statistics-content to-abnormal">异常流量<span class="statistics-num" v-num-animation="historyFlow.otherFlowAbnormal">{{historyFlow.otherFlowAbnormal | exceptionFilter}}</span>GB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </w-row>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="mt15">
      <el-col :span="12">
        <w-row>
          <template slot="title" v-if="roleLevel == 1 || roleLevel == 2">当前流量单位分布(一小时)</template>
          <template slot="title" v-else>当前流量业务分布(一小时)</template>
          <div slot="content" class="charts flex-layout">
            <div id="bubble" class="flex-layout flex-space-3 flex-content-center bubble">
              <no-data></no-data>
            </div>
            <div class="flex-layout flex-space-1 flex-item-row" style="padding:0 0 0 1em;">
              <div class="flex-space-1 text-plugin">
                正常访问用户
                <p>
                  <span id="normalUsers" v-num-animation="disInfoStatic.ipNormal">{{disInfoStatic.ipNormal | exceptionFilter}}</span><sub>个</sub>
                </p>
              </div>
              <div class="flex-space-1 text-plugin to-abnormal">
                异常访问用户
                <p class="exception-text">
                  <span id="exceptionUsers" v-num-animation="disInfoStatic.ipAbnormal">{{disInfoStatic.ipAbnormal | exceptionFilter}}</span><sub>个</sub>
                </p>
              </div>
              <div v-if="roleLevel == 1 || roleLevel == 2" class="flex-space-1 text-plugin to-analyze">
                异常流量单位
                <p class="exception-text"><span v-num-animation="disInfoStatic.count">{{disInfoStatic.count | exceptionFilter}}</span><sub>个</sub></p>
              </div>
              <div v-else class="flex-space-1 text-plugin to-analyzeDetail">
                异常流量业务系统
                <p class="exception-text"><span v-num-animation="disInfoStatic.count">{{disInfoStatic.count | exceptionFilter}}</span><sub>个</sub></p>
              </div>
            </div>
          </div>
        </w-row>
      </el-col>
      <el-col :span="12">
        <w-row>
          <template slot="title">流量趋势(一个月)</template>
          <div class="charts" slot="content" id="flowTrend">
            <no-data></no-data>
          </div>
        </w-row>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="mt15">
      <el-col :span="24">
        <w-table>
          <template slot="title">流量告警列表</template>
          <div slot="info">
            <ul class="table-label">
              <li>告警总个数:<span>{{alarmSum.total | exceptionFilter}}</span>个</li>
              <li>严重:<span class="danger">{{alarmSum.serious | exceptionFilter}}</span>个</li>
              <li>一般:<span class="warning">{{alarmSum.generally | exceptionFilter}}</span>个</li>
              <li>轻微:<span class="normal" >{{alarmSum.slight | exceptionFilter}}</span>个</li>
              <li><a class="cursor-hand" @click="toPage('/maintenance/alarm/event')">查看详情</a></li>
            </ul>
          </div>
          <template slot="table-list">
            <div>
              <el-table
                  :data="tableData"
                  stripe
                  style="width: 100%">
                  <el-table-column
                    prop="time"
                    label="告警时间"
                    :formatter="timeFormat">
                  </el-table-column>
                  <el-table-column
                    prop="level"
                    label="告警级别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.levelCode == 2" class="label-btn low">{{scope.row.level}}</span>
                        <span v-else-if="scope.row.levelCode == 1"  class="label-btn warning">{{scope.row.level}}</span>
                        <span v-else-if="scope.row.levelCode == 0" class="label-btn high">{{scope.row.level}}</span>
                        <span v-else class="label-btn high">未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="businessName"
                    label="告警对象">
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="告警信息">
                  </el-table-column>
              </el-table>
            </div>
          </template>
        </w-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Charts from '@/assets/js/components/chartsFun.js'
import ContentContainer from '@/views/layout/ContentContainer.vue'
import WTitle from '@/components/common/WTitle.vue'
import WRow from '@/components/common/WRow.vue'
import Bubble from '@/assets/js/components/Bubble.js'
import WTable from '@/components/common/WTable.vue'
import NoData from '@/components/common/NoData.vue'
import API from '@/assets/js/api/api.js'
import Util from '@/assets/js/util/util.js'
import CountUp from '@/assets/js/lib/countUp-1.9.3.js'
import menuMixin from '@/components/mixins/menu_mixin.js'
let d3 = require('d3'),
  _1H_Millisecond = 60 * 60 * 1000,
  _Day_Millisecond = 24 * _1H_Millisecond,
  _dateFormat = 'yyyy-MM-dd hh:mm:ss'

function createInfoTip (d) {
  var html = '<div class="node-info"><ul>'
  html += '<li class="info-title"><span>' + d.name + '</span></li>'
  html += '<li class="info-content"><i class="bg-normal"></i><span class="info-content-label">总流量' +
        '</span><span class="info-content-text">' + d.value + 'GB</span></li>'
  html += '<li class="info-content"><i class="bg-abnormal"></i><span class="info-content-label">异常流量' +
        '</span><span class="info-content-text">' + d.props.abnormalFlow + 'GB</span></li>'
  html += '</ul></div>'

  return html
}

export default{
  mixins: [menuMixin],
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-flow',
        name: '互联网流量监管'
      }, {
        iconClass: 'iconfont icon-flow_overview-management',
        name: '流量概览'
      }],
      roleLevel: this.$store.state.userInfo.roleLevel,
      currentFlow: {
        businessFlowAll: '?',
        businessFlowAbnormal: '?',
        otherFlowAll: '?',
        otherFlowAbnormal: '?'
      },
      historyFlow: {
        businessFlowAll: '?',
        businessFlowAbnormal: '?',
        otherFlowAll: '?',
        otherFlowAbnormal: '?'
      },
      disInfoStatic: {
        ipNormal: '?',
        ipAbnormal: '?',
        count: '?'// 异常流量单位或异常流量业务系统
      },
      alarmSum: {
        total: '?',
        serious: '?',
        generally: '?',
        slight: '?'
      },
      total: 0,
      page: 1,
      pageSize: 5,
      tableData: [],
      curServerTime: +new Date(),
      hasBubleData: true
    }
  },
  directives: {
    'num-animation': {
      componentUpdated: function (el, binding) {
        let num = parseFloat(binding.value),
          numStr = String(num)
        if (!isNaN(num)) {
          let decNumber = 0
          if (numStr.split('.')[1]) {
            decNumber = numStr.split('.')[1].length > 2 ? 2 : numStr.split('.')[1].length
          }
          new CountUp(el, 0, num, decNumber, 2.5).start()
        }
      }
    }
  },
  methods: {
    isAdminRole () {
      return this.roleLevel == 1 || this.roleLevel == 2
    },
    getCurrentFlow: function () {
      let vm = this,
        now = vm.curServerTime,
        _dateFormat = 'yyyy-MM-dd hh:00:00',
        timeStart = Util.dateFormat(new Date(now - _1H_Millisecond), _dateFormat),
        timeEnd = Util.dateFormat(new Date(), _dateFormat)

      API.getHistoryFlow(vm, {timeStart, timeEnd})
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.currentFlow = res.data.body
          }
        })
        .catch(function (error) {
          console.info('getCurrentFlow调用出错')
          console.info(error)
        })
    },
    getOneMonthFlow () {
      let vm = this,
        now = new Date(),
        millisecond = now.getTime(),
        monthDays = Util.getMonthDays(now.getFullYear(), now.getMonth() == 0 ? 12 : now.getMonth()), // 获取上一月的天数
        timeStart = Util.dateFormat(new Date(now - monthDays * _Day_Millisecond), _dateFormat),
        timeEnd = Util.dateFormat(now, _dateFormat)

      API.getHistoryFlow(vm, {timeStart, timeEnd})
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.historyFlow = res.data.body
          }
        })
        .catch(function (error) {
          console.info('getOneMonthFlow调用出错')
          console.info(error)
        })
    },
    getDisInfoStatic () {
      let vm = this,
        _dateFormat = 'yyyy-MM-dd hh:00:00',
        now = new Date(vm.curServerTime),
        timeStart = Util.dateFormat(new Date(vm.curServerTime - _1H_Millisecond), _dateFormat),
        timeEnd = Util.dateFormat(now, _dateFormat)

      API.getUsersStatic(vm, timeStart, timeEnd)
        .then(function (res) {
          let staticInfo = {}
          if (res.data && res.data.body) {
            staticInfo = res.data.body
          }
          if (vm.isAdminRole()) {
            API.getAbnormalOrgCount(vm, timeStart, timeEnd)
              .then(function (res) {
                staticInfo.count = res.data.body.count
                vm.disInfoStatic = staticInfo
              })
              .catch(function (error) {
                console.log(error)
              })
          } else {
            API.getAbnormalBusinessCount(vm, timeStart, timeEnd)
              .then(function (res) {
                staticInfo.count = res.data.body.count
                vm.disInfoStatic = staticInfo
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        })

      if (vm.isAdminRole()) {
        API.getFlowDisOrg(vm, timeStart, timeEnd)
          .then(function (res) {
            if (res.data && res.data.body && res.data.body.length > 0) {
              let data
              data = res.data.body.map(function (ele, index, array) {
                return {
                  id: ele.id,
                  name: ele.name,
                  value: ele.flowAll,
                  props: {
                    abnormal: ele.flowAbnormal > 0,
                    abnormalFlow: ele.flowAbnormal,
                    color: ele.flowAbnormal > 0 ? '#EA3344' : '#70C0FF',
                    using: false
                  }
                }
              })
              $('#bubble').html('')

              let option = {
                  data: data,
                  conEle: '#bubble',
                  width: $('#bubble')[0].clientWidth,
                  height: $('#bubble')[0].clientHeight,
                  bubbleMaxR: 30,
                  bubbleMinR: 10,
                  padding: 1
                },
                bubble = new Bubble(option)
              bubble.mouseenter = function (d, node) {
                var $con = $('#bubble')
                var rectBox = $con[0].getBoundingClientRect()
                d3.select(node).style('cursor', 'pointer')

                $con.append(createInfoTip(d))
                $('.node-info').css({
                  left: d3.event.clientX + 20 - rectBox.left,
                  top: d3.event.clientY + 20 - rectBox.top
                }).show()
              }
              bubble.mouseleave = function (d) {
                $('.node-info').remove()
              }
              bubble.init()
            } else {
              vm.hasBubleData = false
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      } else {
        API.getFlowDisBusiness(vm, timeStart, timeEnd)
          .then(function (res) {
            if (res.data && res.data.body && res.data.body.length > 0) {
              let data
              data = res.data.body.map(function (ele, index, array) {
                return {
                  id: ele.id,
                  name: ele.name,
                  value: ele.flowAll,
                  props: {
                    abnormal: ele.flowAbnormal > 0,
                    abnormalFlow: ele.flowAbnormal,
                    color: ele.flowAbnormal > 0 ? '#EA3344' : '#70C0FF',
                    using: false
                  }
                }
              })

              $('#bubble').html('')

              let option = {
                  data: data,
                  conEle: '#bubble',
                  width: $('#bubble')[0].clientWidth,
                  height: $('#bubble')[0].clientHeight,
                  bubbleMaxR: 60,
                  bubbleMinR: 1,
                  padding: 1
                },
                bubble = new Bubble(option)
              bubble.mouseenter = function (d, node) {
                var $con = $('#bubble')
                var rectBox = $con[0].getBoundingClientRect()
                d3.select(node).style('cursor', 'pointer')

                $con.append(createInfoTip(d))
                $('.node-info').css({
                  left: d3.event.clientX + 20 - rectBox.left,
                  top: d3.event.clientY + 20 - rectBox.top
                }).show()
              }
              bubble.mouseleave = function (d) {
                $('.node-info').remove()
              }
              bubble.init()
            } else {
              vm.hasBubleData = false
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    getFlowTrend () {
      let vm = this,
        now = new Date(),
        millisecond = now.getTime(),
        monthDays = Util.getMonthDays(now.getFullYear(), now.getMonth() == 0 ? 12 : now.getMonth()), // 获取上一月的天数
        timeStart = Util.dateFormat(new Date(now - monthDays * _Day_Millisecond), _dateFormat),
        timeEnd = Util.dateFormat(now, _dateFormat)

      API.getFlowTrend(vm, {timeStart, timeEnd})
        .then(function (res) {
          if (res.data && res.data.body && res.data.body.length > 0) {
            let xValue = [],
              value = [{
                name: '正常流量',
                data: []
              }, {
                name: '异常流量',
                data: []
              }],
              lineData = {}
            res.data.body.forEach(function (ele, index, arr) {
              xValue.push(ele.date)
              value[0].data.push(ele.flowNormal)
              value[1].data.push(ele.flowAbnormal)
            })

            lineData.xValue = xValue
            lineData.value = value

            let echartsExtOpt = {
              grid: {
                top: '5%',
                bottom: '15%'
              },
              legend: {
                bottom: '5%'
              }
            }

            Charts.initLine({
              id: 'flowTrend',
              unit: 'GB',
              data: lineData,
              symbol: 'circle',
              smooth: false,
              legendIcon: 'circle',
              opacity: 0,
              options: echartsExtOpt,
              colors: ['#2196F3', '#dd0000']
            })
          }
        })
        .catch(function (error) {
          console.info('getFlowTrend调用出错')
          console.info(error)
        })
    },
    getAlarmSum () {
      let vm = this
      API.getAlarmSum(vm)
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.alarmSum = res.data.body
          }
        })
    },
    getAlarmList () {
      let vm = this
      API.getAlarmList(vm, {page: vm.page, pageSize: vm.pageSize})
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.total = res.data.body.total
            vm.page = res.data.body.page
            vm.pageSize = res.data.body.pageSize
            vm.tableData = res.data.body.data
          }
        })
    },
    timeFormat: function (row, column, cellValue, index) {
      if (typeof cellValue === 'string') {
        return cellValue.split('.')[0]
      } else {
        return '-'
      }
    },
    toPage (url) {
      this.$router.push(url)
    }
  },
  components: {
    ContentContainer,
    WTitle,
    WRow,
    WTable,
    NoData
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
    console.log('flow overview')
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
  mounted () {
    let _that = this
    this.getCurrentFlow()
    this.getOneMonthFlow()
    this.getDisInfoStatic()
    this.getFlowTrend()
    this.getAlarmSum()
    this.getAlarmList()

    $('.to-abnormal').click(function () { // 异常事件跳转
      if (($(this).find('span').text().trim() != 0)) {
        _that.toPage('/flow/event')
      }
    })

    $('.to-analyze').click(function () { // 跳转到分析页
      if (($(this).find('span').text().trim() != 0)) {
        _that.toPage('/flow/analyze')
      }
    })

    $('.to-analyzeDetail').click(function () { // 跳转到分析详情
      if (($(this).find('span').text().trim() != 0)) {
        _that.toPage('/flow/analyze/detail')
      }
    })

    $('#bubble')
      .click(function() {
        if (_that.hasBubleData) {
          _that.toPage('/flow/analyze')
        }
      })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/component/_var.scss';
  @import '@/assets/scss/component/_layout.scss';
  $white:#fff;
  $blue:#2196F3;
  $red:#e62b2d;
  $yellow:#ffb438;
  $lightBlue:#70C0FF;
  $purple:#baa0e9;
  $lightPurple:#d1bcf7;

  .cursor-hand:hover{
    cursor: pointer;
  }

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

  .label-btn.high {
    background:$red;
  }

  .label-btn.warning {
    background:$yellow;
  }

  .label-btn.normal {
    background: $blue
  }

  .whiteBg {
    background: $white;
  }

  .ft-color-white {
    color: $white;
  }

  .bg-blue {
    background: $blue;
  }

  .bg-lightBlue {
    background: $lightBlue;
  }

  .bg-purple {
    background:$purple;
  }

  .bg-lightPurple {
    background:$lightPurple;
  }

  .statistics-module {
    min-height: 70px;
    &:first-child {
      margin-right: 20px;
    }
  }

  .statistics-module {
    .pageIconFont {
      font-size:40px;
    }
  }

  .statistics-topic {
    display: inline-block;
    margin: 1.15em 0.5em 0 0.5em;
    font-size: 14px;
    font-weight: 600;
  }

  .statistics-content {
    font-size: 12px;
    padding-left:1em;
    white-space: nowrap;
  }

  .statistics-content:first-child {
    margin:1em 0 0 0;
  }

  .statistics-num {
    font-size: 18px;
    margin:0 0.1em 0 0.3em;
  }

  .to-abnormal,
  .to-analyze,
  .to-analyzeDetail {
    span {
      cursor: pointer;
    }
  }

  .charts {
    height: 400px;
  }

  .text-plugin {
    p {
      color: #000;
      font-size: 24px;
      margin-top:0.1em;
    }
    sub {
      bottom:0;
      margin-left: 0.2em;
      color: #333;
      font-size: 12px;
    }

    .exception-text {
      color: $color-danger;
    }
  }

  * /deep/ {
    /*气泡图*/
    .bubble {
      position: relative;
    }

  .node {
    cursor: pointer;
  }
  .node-info {
      position: absolute;
      box-shadow: 0 0 10px #ccc;
      background: #fff;
      z-index:10;
    }

    ul {
      list-style: none;
    }

    .info-title {
      padding:0.2em 0.5em;
      background: #ececec;
    }

    .info-content {
      padding-right:0.2em;
      margin-top:0.5em;
      white-space: nowrap;
      background: #fff;
    }

    .info-content > i{
      display: inline-block;
      padding: 0.4em;
      margin: 0 0.25em 0.1em 0.25em;
      vertical-align: middle;
    }

    .info-content-label {
      font-size: 12px;
      margin-right: 1em;
    }

    .bg-normal {
      background: $blue;
    }

    .bg-abnormal {
      background: $color-danger;
    }
  }

  .danger {
    color:$color-danger;
  }

  .warning {
    color:$color-warning;
  }

  .normal {
    color: $blue
  }

  .table-label {
    li {
      display: inline-block;
      margin-right: 1em;
      span {
        margin: 0 0.2em;
      }
      a {
        color:$blue;
        text-decoration: none;
      }
    }
}

</style>
