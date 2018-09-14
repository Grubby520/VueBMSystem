<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="24">
        <div v-for="(item,index) in resPoolList" :key="index" class="respool-module">
          <div class="respool-content whiteBg">
            <div class="respool-content-head table-block">
              <div class="table-cell table-cell-4_1">
                <div class="data-icon" :class="item.performStatus" v-show="item.performStatus == 'best'">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-vm-abundant"></use>
                  </svg>
                </div>
                <div class="data-icon" :class="item.performStatus" v-show="item.performStatus == 'good'">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-vm-good"></use>
                  </svg>
                </div>
                <div class="data-icon" :class="item.performStatus" v-show="item.performStatus == 'general'">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-vm-general"></use>
                  </svg>
                </div>
                <div class="data-icon" :class="item.performStatus" v-show="item.performStatus == 'bad'">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-vm-shortage"></use>
                  </svg>
                </div>
              </div>
              <div class="table-cell table-cell-4_3">
                <div class="hNav-toggle">
                  <h1>{{item.regionProviderName}}</h1>
                </div>
                <p class="perform-statustext111">性能：<span class="status-text" :class='statusColor(item.capacityStatusCn)'>{{item.capacityStatusCn}}</span></p>
              </div>
            </div>
            <div class="respool-content-body">
              <div class="content-label">
                <p>
                虚拟资源分配情况:
                <span class="label-btn" :class="statusClassName(item.capacityStatusCn)">{{item.capacityStatusCn}}</span>
                </p>
                <div class="echart-con" :id="'echarts-radar-'+index" style="height:120px;" v-echarts-radar="item.rate"
                :data-status="statusColor(item.capacityStatusCn, true)" @click="toResDistributionPage(item.regionProviderId)"></div>
                <p>
                物理资源当前负载:
                <span class="res-number status-text" :class="statusColor(item.loadEvaluation)">{{item.loadRate}}<sub>%</sub></span>
                <span class="label-btn" :class="statusClassName(item.loadEvaluation)">{{statusText(item.loadEvaluation)}}</span>
                </p>
                <div class="echart-con" :id="'echarts-line-'+index" style="height:100px;" v-echarts-line="item.trend"
                :data-status="item.runStatus" @click="toResLoadPage(item.regionProviderId)"></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="24">
        <w-tabs :active-name="activeName" :handle-click="handleClick" class="whiteBg" style="padding-left:15px;">
          <el-tab-pane label="资产变更事件" name="event_asset_change">
            <!-- tab 1 -->
            <w-table>
              <template slot="title">资产变更事件列表</template>
              <div slot="opt">
                <el-date-picker
                  v-model="assetChangeSearchList.startDate"
                  type="datetime"
                  name="startDate"
                  placeholder="选择开始时间">
                </el-date-picker>
                <el-date-picker
                  v-model="assetChangeSearchList.endDate"
                  type="datetime"
                  name="endDate"
                  placeholder="选择结束时间">
                </el-date-picker>
                <base-button-group>
                  <base-button @click="searchFn('change')">查询</base-button>
                </base-button-group>
              </div>
              <template slot="table-list">
                <div>
                  <el-table
                      :data="assetsChangeTableList"
                      stripe
                      style="width: 100%">
                      <el-table-column
                        prop="eventTime"
                        label="时间">
                      </el-table-column>
                      <el-table-column
                        prop="eventType"
                        label="资源类型">
                      </el-table-column>
                      <el-table-column
                        prop="poolName"
                        label="资源池">
                      </el-table-column>
                      <el-table-column
                        prop="eventTypeName"
                        label="变更类型">
                      </el-table-column>
                      <el-table-column
                        prop="countBefore"
                        label="变更前资源">
                      </el-table-column>
                      <el-table-column
                        prop="countAfter"
                        label="变更后资源">
                      </el-table-column>
                  </el-table>
                  <el-pagination
                      v-show="assetChangeSearchList.total > assetChangeSearchList.pageSize"
                      @current-change="assetChangeFn"
                      :current-page="assetChangeSearchList.page"
                      :page-size="assetChangeSearchList.pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="assetChangeSearchList.total">
                  </el-pagination>
                </div>
              </template>
            </w-table>
          </el-tab-pane>
          <el-tab-pane label="资产负载异常事件" name="event_abnormal_change">
            <!-- tab 1 -->
            <w-table>
              <template slot="title">资产负载异常事件列表</template>
              <div slot="opt">
                <el-date-picker
                  v-model="assetAbnormalSearchList.startDate"
                  type="datetime"
                  name="startDate"
                  placeholder="选择开始时间">
                </el-date-picker>
                <el-date-picker
                  v-model="assetAbnormalSearchList.endDate"
                  type="datetime"
                  name="endDate"
                  placeholder="选择结束时间">
                </el-date-picker>
                <base-button-group>
                  <base-button @click="searchFn('abnormal')">查询</base-button>
                </base-button-group>
              </div>
              <template slot="table-list">
                <div>
                  <el-table
                      :data="assetsAbnormalTableList"
                      stripe
                      style="width: 100%">
                      <el-table-column
                        prop="eventTime"
                        label="时间">
                      </el-table-column>
                      <el-table-column
                        prop="eventType"
                        label="事件类型">
                      </el-table-column>
                      <el-table-column
                        prop="poolName"
                        label="资源池">
                      </el-table-column>
                      <el-table-column
                        prop="resourceType"
                        label="资源类型">
                      </el-table-column>
                      <el-table-column
                        prop="resourceName"
                        label="资源名称">
                      </el-table-column>
                      <el-table-column
                        prop="load"
                        label="负载值">
                      </el-table-column>
                  </el-table>
                  <el-pagination
                      v-show="assetAbnormalSearchList.total > assetAbnormalSearchList.pageSize"
                      @current-change="assetAbnormalFn"
                      :current-page="assetAbnormalSearchList.page"
                      :page-size="assetAbnormalSearchList.pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="assetAbnormalSearchList.total">
                  </el-pagination>
                </div>
              </template>
            </w-table>
          </el-tab-pane>
        </w-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
import menuMixin from '@/components/mixins/menu_mixin.js'
import Charts from '@/assets/js/components/chartsFun.js'
import API from '@/assets/js/api/api.js'
import Util from '@/assets/js/util/util.js'
import WTabs from '@/components/common/WTabs.vue'
import WTable from '@/components/common/WTable.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
const colorMap = {
  'normal': '#3ECB79', // 好
  'abnormal': '#D71919', // 中
  'idle': '#F39800',
  'busy': '#D71919', // 差
  '0': '#D71919',
  '1': '#3ECB79'
}

export default {
  mixins: [menuMixin],
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-resourceSupervision',
        name: '资源监管'
      }, {
        iconClass: 'iconfont icon-resource_capacity-management',
        name: '资源容量'
      }],
      resPoolList: [], // 资源池模块数据
      abnormalText: '?', // 用于替代后台返回的异常数值型数据
      activeName: 'event_asset_change', // 默认显示tabName
      // table-1
      assetsChangeTableList: [
        {
        "id":"1",
        "eventTime":"2018-09-12 17:23:51",
        "poolId":"1",
        "poolName":"1",
        "eventType":1,
        "eventTypeName":"存储服务器数量变更",
        "countBefore":234.0,
        "countAfter":234.0
        }
      ],
      assetChangeSearchList: {
        total: 0,
        page: 1,
        pageSize: 10,
        startDate: '',
        endDate: ''
      },
      // table-2
      assetsAbnormalTableList: [
        {
        "id":"1",
        "eventTime":"2018-09-12 17:23:11",
        "poolId":"1",
        "poolName":"1",
        "eventType":3,
        "eventTypeName":"存储设备负载过高",
        "resourceType":"虚拟机",
        "resourceName":"vm-001",
        "load":99.9
        }
      ],
      assetAbnormalSearchList: {
        total: 0,
        page: 1,
        pageSize: 10,
        startDate: '',
        endDate: ''
      }
    }
  },
  components: {
    WTabs,
    WTable,
    BaseButton,
    BaseButtonGroup
  },
  created() {
    this.init()
    this.getResEventDeviceChange()
    this.getResEventLoad()
  },
  methods: {
    init() {
      this.getRegionList() // 并发
    },
    percentNum(num) {
      return Number(num) * 100
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    assetChangeFn: function (curPage) {
      this.assetChangeSearchList.page = curPage
    },
    assetAbnormalFn: function (curPage) {
      this.assetAbnormalSearchList.page = curPage
    },
    searchFn(type) {
      if (type === 'change') {
        this.getResEventDeviceChange(this.assetChangeSearchList)
      }
      else if (type === 'abnormal') {
        this.getResEventLoad(this.assetAbnormalSearchList)
      }
    },
    isNumber: function (value) {
      if (typeof value === 'number') {
        return true
      } else {
        return false
      }
    },
    doNumberText: function (value) {
      if (this.isNumber(value)) {
        return value
      } else {
        return this.abnormalText
      }
    },
    statusText: function (status) {
      let map = {
        '低': '负载低',
        '中': '负载中',
        '高': '负载高'
      }
      return map[status] ? map[status] : '?'
    },
    statusColor: function (status, getStatus) {
      let map = {
        '低': 'busy',
        '中': 'normal',
        '高': 'busy',
        '充足': getStatus ? 1 : 'normal',
        '不充足': getStatus ? 0 : 'busy'
      }
      return map[status] ? map[status] : '?'
    },
    statusClassName: function (text) {
      let map = {
        '低': 'busy',
        '中': 'normal',
        '高': 'busy',
        '充足': 'normal',
        '不充足': 'busy'
      }
      return map[text] ? map[text] : 'good'
    },
    statusClass: function (status) {
      let map = {
        0: 'shortage',
        1: 'enough'
      }
      return map[status] ? map[status] : ''
    },
    toResDistributionPage: function (id) {

    },
    toResLoadPage: function (id) {

    },
    // 请求序列
    getRegionList() {
      const self = this
      axios.all([this.getRegionProviderList(), this.getResCapacityPoolList(), this.getResLoadPhyResList(), this.getResLoadTrendResPoolList()])
        .then(axios.spread(function(providerList, poolList, resList, loadList) {
          // 1111
          if (providerList.status == 200 && providerList.statusText == 'OK') {
            providerList = providerList.data.body
            console.log(providerList)
            providerList.forEach((val, i) => {
              self.resPoolList.push({
                regionProviderId: val.regionProviderId,
                regionProviderName: val.regionProviderName,
                regionId: val.regionId,
                providerId: val.providerId
              })
            })
          }
          // 2222
          if (poolList.status == 200 && poolList.statusText == 'OK') {
            poolList = poolList.data.body.data
            console.log(poolList)
            poolList.forEach((val, i) => {
              const temp = val.regionId // 暂时用regionId关联数据
              self.resPoolList.forEach((nVal, nI) => {
                if (nVal.regionId == temp) {
                  nVal.rate = [
                    {
                      'name': '内存',
                      'value': val.memory
                    },
                    {
                      'name': '云存储',
                      'value': val.storage
                    },
                    {
                      'name': 'CPU',
                      'value': val.cpu
                    }
                  ]
                  nVal.capacityStatusCn = val.capacityStatusCn
                  return false
                }
              })
            })
          }
          // 3333
          if (resList.status == 200 && resList.statusText == 'OK') {
            resList = resList.data.body.data
            console.log(resList)
            resList.forEach((val, i) => {
              const temp = val.id // 暂时用id?什么id 关联
              self.resPoolList.forEach((nVal, nI) => {
                if (nVal.regionId == temp) {
                  nVal.loadRate = this.percentNum(val.loadRate)
                  nVal.loadEvaluation = val.loadEvaluation
                }
              })
            })
          }
          // 4444
          if (loadList.status == 200 && loadList.statusText == 'OK') {
            loadList = loadList.data.body
            console.log(loadList)
            resList.forEach((val, i) => {
              const temp = val.poolId // 关联id
              self.resPoolList.forEach((nVal, nI) => {
                if (nVal.regionId == temp) {
                  const innerData = val.data
                  self.resPoolList[nI].trend = {
                    xValue: [],
                    value: [{
                      name: '',
                      data: []
                    }]
                  }
                  innerData.forEach((iVal, iI) => {
                    self.resPoolList[nI].trend.xValue.push(iVal.date)
                    self.resPoolList[nI].trend.value[0].name = iVal.name
                    self.resPoolList[nI].trend.value[0].data.push(iVal.loadRate * 100) // 百分数
                  })
                }
              })
            })
          }
        }))
    },
    // 资源池及对应单位和应用列表
    getRegionProviderList() {
      return API.getRegionProviderList(this)
    },
    // 资源池剩余容量信息
    getResCapacityPoolList () {
      return API.getResCapacityPoolList(this, {
        statisticsBy: 'regionType',
        timeStart: '2018-08-10 00:00:00',
        timeEnd: '2018-09-10 00:00:00'
      })
    },
    // 物理资源负载信息
    getResLoadPhyResList () {
      return API.getResLoadPhyResList(this)
    },
    // 资源池负载趋势信息
    getResLoadTrendResPoolList () {
      return API.getResLoadTrendResPoolList(this)
    },
    // table
    // 配置变更事件
    getResEventDeviceChange(params = {}) {
      API.getResEventDeviceChange(this, params)
        .then((res) => {
          console.log('配置变更事件')
          console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            this.assetsChangeTableList = res.data
            this.assetChangeSearchList.total = res.total
            this.assetChangeSearchList.pageSize = res.pageSize
            this.assetChangeSearchList.page = res.page
          }
        })
    },
    // 负载异常事件
    getResEventLoad(params = {}) {
      API.getResEventLoad(this, params)
        .then((res) => {
          console.log('负载异常事件')
          console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            this.assetsAbnormalTableList = res.data
            this.assetAbnormalSearchList.total = res.total
            this.assetAbnormalSearchList.pageSize = res.pageSize
            this.assetAbnormalSearchList.page = res.page
          }
        })
    }
  },
  directives: {
    'echarts-line': {
      'inserted': function (el, binding) {
        let data = binding.value
        let id = el.id
        let status = el.getAttribute('data-status')

        if (!data) {
          data = 'nodata'
        }
        Charts.initLine({
          id: id,
          unit: '%',
          opacity: 0,
          data: data,
          options: {
            grid: {
              right: '15%',
              top: '5%',
              bottom: '10%'
            },
            xAxis: [{
              axisTick: {
                show: false
              },
              axisLabel: {
                fontSize: 10
              }
            }],
            yAxis: [{
              show: false
            }],
            legend: {
              show: false
            }
          },
          colors: [colorMap[status]]
        })
      }
    },
    'echarts-radar': {
      'inserted': function (el, binding) {
        let [data, id, status] = [binding.value, el.id, el.getAttribute('data-status')]
        if (!data || data.length == 0) {
          data = 'nodata'
        }

        Charts.initRadar({
          id: id,
          opts: {
            textStyle: {
              color: '#555'
            },
            radar: [
              {
                radius: 40,
                center: ['50%', '60%']
              }
            ],
            series: [
              {
                name: '虚拟资源分配情况',
                itemStyle: {
                  normal: {
                    borderColor: colorMap[status]
                  }
                },
                lineStyle: {
                  normal: {
                    color: colorMap[status]
                  }
                },
                areaStyle: {
                  normal: {
                    color: colorMap[status]
                  }
                }
              }
            ]
          },
          data: data
        })
      }
    }
  },
  mounted () {
    this.resPoolList = [
      {
        'regionProviderId': '1d00a36e-3ee6-11e8-9e3f-00e0ed433b66',
        'regionProviderName': '互联网资源池-移动',
        'regionId': '',
        'providerId': '',
        'performStatus': 'good', // 图标 字体 chart背景色
        'capacityStatusCn': '充足', // 转换virtualAllocate:: 0/1
        'loadEvaluation': '低', // 映射到className
        'loadRate': 30.0,
        'runStatus': 'busy', // 线条颜色
        'rate': [
          {
            'name': '内存',
            'value': 50.0
          },
          {
            'name': '云存储',
            'value': 77.78
          },
          {
            'name': 'CPU',
            'value': 20.0
          }
        ],
        'trend': {
          'xValue': [
            '周四',
            '周五',
            '周六',
            '周日',
            '周二',
            '周四',
            '周五'
          ],
          'value': [
            {
              'name': '互联网资源池-移动',
              'data': [
                88.0,
                25.0,
                16.0,
                71.0,
                33.0,
                55.0,
                30.0
              ]
            }
          ]
        }
      }
    ]
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/component/_var.scss';
@import '@/assets/scss/component/_layout.scss';
@import '@/assets/scss/element_layout_init.scss';
$green: #3ECB79;
$red:#D71919;
$yellow:#F39800;
$blue:#2D9BF2;

.table-cell-4_1 {
  width: 25%;
}

.table-cell-4_3 {
  width: 75%;
}

.hNav-toggle h1 {
  font-size: 14px;
}

/*状态button*/
.label-btn.abnormal,
.label-btn.busy,
.label-btn.shortage {
  background: $red;
}

.label-btn.normal,
.label-btn.enough {
  background: $green;
}

.label-btn.idle {
  background: $yellow;
}

/*状态文本*/
.status-text.abnormal,
.status-text.busy{
  color: $red;
}

.status-text.normal {
  color: $green;
}

.status-text.idle {
  color: $yellow;
}

.respool-module {
  width: 25%;
  float: left;
  padding-right: 15px;
  margin-bottom: 15px;
  box-sizing: border-box;
  &:nth-of-type(4n) {
    padding-right: 0px;
  }
  .respool-content {
    height: 370px;
    padding:1em;
    box-sizing: border-box;
    border-top-left-radius: 0.3em;
    border-top-right-radius: 0.3em;
    border-top: 4px solid transparent;

    .respool-content-head {
      & > div:last-child {
        padding: 0 0.5em;
        width: 75%;
        .hNav-toggle {
          height: 40px;
        }
        h1 {
          line-height: 40px;
          padding-left:0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        p {
          font-size: 12px;
        }
      }
    }
  }

  .respool-content-body {
    margin-top: 0.5em;
    .content-label {
      p {
        font-size: 12px;
      }
    }
    .res-number {
      font-size:20px;
      margin:0 0.2em;
      sub {
        bottom:0;
        vertical-align: middle;
      }
    }
  }

  .echart-con {
    height: 150px;
    &:hover {
      canvas {
        cursor: pointer;
      }
      box-shadow: 0 0 10px #ccc;
    }
  }

  .data-icon {
    width: 66px;
    height: 66px;
    line-height: 66px;
    margin: 0 auto;
    text-align: center;
    padding: 0.5em;
    border-radius: 100%;
    background: #f6f6f6;
    box-sizing: border-box;

    svg[class*='icon'] {
      font-size: 30px;
    }
  }

  .data-icon.best {
    background:#E5F3EE;
  }

  .data-icon.good {
    background:#e9eff4;
  }

  .data-icon.general {
    background:#f4ece9;
  }

  .data-icon.bad {
    background:#F3E6E4;
  }

  .respool-content.best {
    border-top-color: $green;
    .perform-statustext {
      color: $green;
    }
  }

  .respool-content.good {
    border-top-color: $blue;
    .perform-statustext {
      color: $blue;
    }
  }

  .respool-content.general {
    border-top-color: $yellow;
    .perform-statustext {
      color: $yellow;
    }
  }

  .respool-content.bad {
    border-top-color: $red;
    .perform-statustext {
      color: $red;
    }
  }
}

.el-date-editor.el-input{
  margin-right:6px;
  width: 180px;
  /deep/ .el-input__inner{
    width: 100%;
  }
}

</style>
