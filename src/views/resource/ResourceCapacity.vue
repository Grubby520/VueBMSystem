<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="24">
        <div v-for="(item,index) in resPoolList" :key="index" class="respool-module">
          <div class="respool-content whiteBg" :class="item.performStatus">
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
                  <h1>{{item.providerRegionName}}</h1>
                </div>
                <p class="perform-statustext">性能：{{statusText(item.performStatus)}}</p>
              </div>
            </div>
            <div class="respool-content-body">
              <div class="content-label">
                <p>
                虚拟资源分配情况:
                <span class="label-btn" :class="statusClass(item.virtualAllocate)">{{statusText(item.virtualAllocate)}}</span>
                </p>
                <div class="echart-con" :id="'echarts-radar-'+index" style="height:120px;" v-echarts-radar="item.rate"
                :data-status="item.virtualAllocate" @click="toResDistributionPage(item.providerRegionId)"></div>
                <p>
                物理资源当前负载:
                <span class="res-number status-text" :class="item.runStatus">{{item.loadRadio}}<sub>%</sub></span>
                <span class="label-btn" :class="item.runStatus">{{statusText(item.runStatus)}}</span>
                </p>
                <div class="echart-con" :id="'echarts-line-'+index" style="height:100px;" v-echarts-line="item.trend"
                :data-status="item.runStatus" @click="toResLoadPage(item.providerRegionId)"></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="24">
        <w-tabs :active-name="activeName" :handle-click="handleClick" class="whiteBg" style="padding-left:15px;">
          <el-tab-pane label="资产变更事件" name="event_asset-change">
            <w-table>
              <template slot="title">资产变更事件列表</template>
              <div slot="opt">
                <el-date-picker
                  v-model="startDate"
                  type="datetime"
                  name="startDate"
                  placeholder="选择开始时间">
                </el-date-picker>
                <el-date-picker
                  v-model="endDate"
                  type="datetime"
                  name="endDate"
                  placeholder="选择结束时间">
                </el-date-picker>
                <base-button-group>
                  <base-button @click="alert('查询')">查询</base-button>
                </base-button-group>
              </div>
              <template slot="table-list">
                <div>
                  <el-table
                      :data="assetsChangeList"
                      stripe
                      style="width: 100%">
                      <el-table-column
                        prop="time"
                        label="时间">
                      </el-table-column>
                      <el-table-column
                        prop="resPool"
                        label="资源池">
                      </el-table-column>
                      <el-table-column
                        prop="changeType"
                        label="变更类型">
                      </el-table-column>
                      <el-table-column
                        prop="beforeChange"
                        label="变更前资源">
                      </el-table-column>
                      <el-table-column
                        prop="afterChange"
                        label="变更后资源">
                      </el-table-column>
                  </el-table>
                  <el-pagination
                      v-show="total > pageSize"
                      @current-change="currentChange"
                      :current-page="page"
                      :page-size="pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="total">
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
import menuMixin from '@/components/mixins/menu_mixin.js'
import Charts from '@/assets/js/components/chartsFun.js'
import API from '@/assets/js/api.js'
import Util from '@/assets/js/util/util.js'
import WTabs from '@/components/common/WTabs.vue'
import WTable from '@/components/common/WTable.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
const colorMap = {
  'normal': '#3ECB79',
  'abnormal': '#D71919',
  'idle': '#F39800',
  'busy': '#D71919',
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
      emptyText: '暂无数据',
      activeName: 'event_asset-change',
      assetsChangeList: [],
      total: 0,
      page: 1,
      pageSize: 10,
      startDate: '',
      endDate: ''
    }
  },
  components: {
    WTabs,
    WTable,
    BaseButton,
    BaseButtonGroup
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    currentChange: function (curPage) {
      this.page = curPage
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
        'best': '优',
        'good': '良',
        'general': '中',
        'bad': '差',
        'normal': '正常',
        'abnormal': '异常',
        'idle': '负载低',
        'busy': '负载高',
        0: '不足',
        1: '充足'
      }

      return map[status] ? map[status] : '?'
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

    }
  },
  directives: {
    'echarts-line': {
      'inserted': function (el, binding) {
        let data = binding.value,
          id = el.id,
          status = el.getAttribute('data-status')

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
        let data = binding.value,
          id = el.id,
          status = el.getAttribute('data-status')

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
        'providerRegionId': '1d00a0ba-3ee6-11e8-9e3f-00e0ed433b66',
        'providerRegionName': '互联网资源池-移动',
        'cpuTotalAmount': 1000,
        'cpuUsageAmount': 200,
        'memoryTotalAmount': 500.0,
        'memoryUsageAmount': 250.0,
        'storageTotalAmount': 900.0,
        'storageUsageAmount': 700.0,
        'ipTotalAmount': 50,
        'ipUsageAmount': 25,
        'virtualAllocate': 1,
        'performStatus': 'good',
        'runStatus': 'normal',
        'loadRadio': 30.0,
        'resourceLoads': [
          {
            'trendId': '9',
            'runStatus': 'normal',
            'loadRadio': 88.0,
            'gatherTime': '2018-05-24 11:32:56'
          },
          {
            'trendId': '8',
            'runStatus': 'normal',
            'loadRadio': 25.0,
            'gatherTime': '2018-05-25 11:32:56'
          },
          {
            'trendId': '7',
            'runStatus': 'normal',
            'loadRadio': 16.0,
            'gatherTime': '2018-05-26 11:32:56'
          },
          {
            'trendId': '6',
            'runStatus': 'normal',
            'loadRadio': 71.0,
            'gatherTime': '2018-05-27 11:32:56'
          },
          {
            'trendId': '5',
            'runStatus': 'normal',
            'loadRadio': 33.0,
            'gatherTime': '2018-05-29 18:32:56'
          },
          {
            'trendId': '2',
            'runStatus': 'normal',
            'loadRadio': 55.0,
            'gatherTime': '2018-05-31 11:32:56'
          },
          {
            'trendId': '1',
            'runStatus': 'normal',
            'loadRadio': 30.0,
            'gatherTime': '2018-06-01 11:32:56'
          }
        ],
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
      },
      {
        'providerRegionId': '1d00a2c3-3ee6-11e8-9e3f-00e0ed433b66',
        'providerRegionName': '互联网资源池-联通',
        'cpuTotalAmount': 200,
        'cpuUsageAmount': 180,
        'memoryTotalAmount': 300.0,
        'memoryUsageAmount': 290.0,
        'storageTotalAmount': 700.0,
        'storageUsageAmount': 650.0,
        'ipTotalAmount': 50,
        'ipUsageAmount': 45,
        'virtualAllocate': 0,
        'performStatus': 'good',
        'runStatus': 'abnormal',
        'loadRadio': 0.0,
        'resourceLoads': [
          {
            'trendId': '16',
            'runStatus': 'abnormal',
            'loadRadio': 53.0,
            'gatherTime': '2018-05-26 11:32:56'
          },
          {
            'trendId': '15',
            'runStatus': 'abnormal',
            'loadRadio': 99.0,
            'gatherTime': '2018-05-27 11:32:56'
          },
          {
            'trendId': '14',
            'runStatus': 'abnormal',
            'loadRadio': 18.0,
            'gatherTime': '2018-05-28 11:32:56'
          },
          {
            'trendId': '13',
            'runStatus': 'abnormal',
            'loadRadio': 71.0,
            'gatherTime': '2018-05-29 11:32:56'
          },
          {
            'trendId': '12',
            'runStatus': 'abnormal',
            'loadRadio': 23.0,
            'gatherTime': '2018-05-30 11:32:56'
          },
          {
            'trendId': '11',
            'runStatus': 'abnormal',
            'loadRadio': 89.0,
            'gatherTime': '2018-05-31 11:32:56'
          },
          {
            'trendId': '10',
            'runStatus': 'abnormal',
            'loadRadio': 0.0,
            'gatherTime': '2018-06-01 11:32:56'
          }
        ],
        'rate': [
          {
            'name': '内存',
            'value': 96.67
          },
          {
            'name': '云存储',
            'value': 92.86
          },
          {
            'name': 'CPU',
            'value': 90.0
          }
        ],
        'trend': {
          'xValue': [
            '周六',
            '周日',
            '周一',
            '周二',
            '周三',
            '周四',
            '周五'
          ],
          'value': [
            {
              'name': '互联网资源池-联通',
              'data': [
                53.0,
                99.0,
                18.0,
                71.0,
                23.0,
                89.0,
                0.0
              ]
            }
          ]
        }
      },
      {
        'providerRegionId': '1d00a36e-3ee6-11e8-9e3f-00e0ed433b66',
        'providerRegionName': '政务外网资源池-联通',
        'cpuTotalAmount': 200,
        'cpuUsageAmount': 180,
        'memoryTotalAmount': 300.0,
        'memoryUsageAmount': 290.0,
        'storageTotalAmount': 700.0,
        'storageUsageAmount': 650.0,
        'ipTotalAmount': 50,
        'ipUsageAmount': 45,
        'virtualAllocate': 0,
        'performStatus': 'general',
        'runStatus': 'idle',
        'loadRadio': 8.0,
        'resourceLoads': [
          {
            'trendId': '22',
            'runStatus': 'idle',
            'loadRadio': 12.0,
            'gatherTime': '2018-05-30 11:32:56'
          },
          {
            'trendId': '21',
            'runStatus': 'idle',
            'loadRadio': 15.0,
            'gatherTime': '2018-05-31 11:32:56'
          },
          {
            'trendId': '20',
            'runStatus': 'idle',
            'loadRadio': 8.0,
            'gatherTime': '2018-06-01 11:32:56'
          }
        ],
        'rate': [
          {
            'name': '内存',
            'value': 96.67
          },
          {
            'name': '云存储',
            'value': 92.86
          },
          {
            'name': 'CPU',
            'value': 90.0
          }
        ],
        'trend': {
          'xValue': [
            '周三',
            '周四',
            '周五'
          ],
          'value': [
            {
              'name': '政务外网资源池-联通',
              'data': [
                12.0,
                15.0,
                8.0
              ]
            }
          ]
        }
      },
      {
        'providerRegionId': '1d00a3eb-3ee6-11e8-9e3f-00e0ed433b66',
        'providerRegionName': '政务外网资源池-移动',
        'cpuTotalAmount': 200,
        'cpuUsageAmount': 180,
        'memoryTotalAmount': 300.0,
        'memoryUsageAmount': 290.0,
        'storageTotalAmount': 700.0,
        'storageUsageAmount': 650.0,
        'ipTotalAmount': 50,
        'ipUsageAmount': 45,
        'virtualAllocate': 0,
        'performStatus': 'bad',
        'runStatus': 'busy',
        'loadRadio': 67.0,
        'resourceLoads': [
          {
            'trendId': '36',
            'runStatus': 'busy',
            'loadRadio': 78.0,
            'gatherTime': '2018-05-24 11:32:56'
          },
          {
            'trendId': '31',
            'runStatus': 'busy',
            'loadRadio': 77.0,
            'gatherTime': '2018-05-25 11:32:56'
          },
          {
            'trendId': '32',
            'runStatus': 'busy',
            'loadRadio': 88.0,
            'gatherTime': '2018-05-28 11:32:56'
          },
          {
            'trendId': '33',
            'runStatus': 'busy',
            'loadRadio': 87.0,
            'gatherTime': '2018-05-29 11:32:56'
          },
          {
            'trendId': '34',
            'runStatus': 'busy',
            'loadRadio': 67.0,
            'gatherTime': '2018-05-30 11:32:56'
          },
          {
            'trendId': '35',
            'runStatus': 'busy',
            'loadRadio': 77.0,
            'gatherTime': '2018-05-31 11:32:56'
          },
          {
            'trendId': '30',
            'runStatus': 'busy',
            'loadRadio': 67.0,
            'gatherTime': '2018-06-01 11:32:56'
          }
        ],
        'rate': [
          {
            'name': '内存',
            'value': 96.67
          },
          {
            'name': '云存储',
            'value': 92.86
          },
          {
            'name': 'CPU',
            'value': 90.0
          }
        ],
        'trend': {
          'xValue': [
            '周四',
            '周五',
            '周一',
            '周二',
            '周三',
            '周四',
            '周五'
          ],
          'value': [
            {
              'name': '政务外网资源池-移动',
              'data': [
                78.0,
                77.0,
                88.0,
                87.0,
                67.0,
                77.0,
                67.0
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
