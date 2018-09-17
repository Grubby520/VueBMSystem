<template>
  <div>
    <el-row :gutter="15" style="overflow:hidden;">
      <el-col :span="6">
        <div class="nav__container whiteBg" v-init-screen-h="125" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="nav-logo"><span class="pageIconFont icon-respool"></span></div>
          <div class="nav-content">
            <h1 class="page-portrait" id="chooseBtn">
              {{currentRegionProvider.name}}
              <span class="pageIconFont icon-triangle-bottom page-portrait-icon"></span>
            </h1>
            <w-dropdown
              @item-click="itemClickHandle"
              :itemlist="itemlist"
              :placeholder="placeholder"
              :nodatatext="nodatatext"
              :show="showDropDown"></w-dropdown>
            <div class="nav-content__detail">
              <div class="nav-content__basicinfo">
                服务商：{{currentRegionProvider.providerName}}
                <span>容量状态：<span class="label-btn" :class="currentRegionProvider.capacityStatusCn == '充足' ? 'enough' : 'shortage'">{{currentRegionProvider.capacityStatusCn}}</span></span>
              </div>
              <w-progress-bar style="margin-bottom:4em;"
              label="物理资源利用率"
              :text="switchString(currentRegionProvider.resourceRate)"
              :percentage="currentRegionProvider.resourceRate"
              :height="20"
              :color="switchClassName({value: currentRegionProvider.resourceRate, isColor: true})"></w-progress-bar>
              <h3 style="margin-bottom:1.5em;font-size:14px;" v-show="currentRegionProvider.length">虚拟资源分配情况</h3>
              <w-progress-bar
              label="CPU"
              :text="switchString(currentRegionProvider.cpu, 'GB')"
              :percentage="currentRegionProvider.cpuRate"
              :height="20"
              :color="switchClassName({value: currentRegionProvider.cpuRate, isColor: true})"
              :showpercent="true"></w-progress-bar>
              <w-progress-bar
              label="内存"
              :text="switchString(currentRegionProvider.memory, 'GB')"
              :percentage="currentRegionProvider.memoryRate"
              :height="20"
              :color="switchClassName({value: currentRegionProvider.memoryRate, isColor: true})"
              :showpercent="true"></w-progress-bar>
              <w-progress-bar
              label="CPU"
              :text="switchString(currentRegionProvider.storage, 'GB')"
              :percentage="currentRegionProvider.storageRate"
              :height="20"
              :color="switchClassName({value: currentRegionProvider.storageRate, isColor: true})"
              :showpercent="true"></w-progress-bar>
              <ul class="nav-content__reslist">
                <li v-for="(item,index) in currentRegionProvider.list" :key="index">
                  {{item.label}}
                  <span>{{item.text}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="whiteBg" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="content-header">
            <label>{{currentRegionProvider.name}}</label><span class="content-header-text__gray">单位总数:{{currentRegionProvider.tenantLength}}个</span>
          </div>
          <w-title>分配较多单位TOP5</w-title>
          <div class="echarts-container">
            <div id="top5" class="echarts-content"></div>
          </div>
          <w-title>单位资源分配详细情况</w-title>
          <w-table>
              <!-- <template slot="title"></template>
              <div slot="opt"></div> -->
              <template slot="table-list">
                <div>
                  <el-table
                      :data="tableList"
                      stripe
                      @sort-change="sortChangeFn"
                      style="width: 100%">
                      <el-table-column
                        type="index"
                        label="ID">
                      </el-table-column>
                      <el-table-column
                        prop="orgName"
                        label="单位">
                        <template slot-scope="scope">
                          <!-- <router-link :to="'/resource/distribution/detail/'+scope.row.orgId" class="a_link to_detail">
                            {{scope.row.orgName}}
                          </router-link> -->
                          <router-link class="a_link to_detail" :to="{
                            name: 'resource_distribution_detail',
                            params: {
                              orgId: scope.row.orgId,
                              orgName: scope.row.orgName,
                              regionProviderId : currentRegionProvider.id
                            }
                          }">
                            {{scope.row.orgName}}
                          </router-link>
                        </template>
                      </el-table-column>
                      <el-table-column
                        sortable="custom"
                        prop="instance"
                        label="云主机(台)">
                      </el-table-column>
                      <el-table-column
                        sortable="custom"
                        prop="memory"
                        label="内存(GB)">
                      </el-table-column>
                      <el-table-column
                        sortable="custom"
                        prop="storage"
                        label="存储(GB)">
                      </el-table-column>
                      <el-table-column
                        sortable="custom"
                        prop="cpu"
                        label="CPU(核)">
                      </el-table-column>
                      <el-table-column
                        sortable="custom"
                        prop="status"
                        label="容量状态">
                        <template slot-scope="scope">
                          <span v-if="scope.row.status == 1" class="label-btn enough">充足</span>
                          <span v-else-if="scope.row.status == 0"  class="label-btn shortage">不足</span>
                          <span v-else>未知</span>
                        </template>
                      </el-table-column>
                  </el-table>
                  <el-pagination
                      v-show="searchList.total > searchList.pageSize"
                      @current-change="currentChangeFn"
                      :current-page="searchList.page"
                      :page-size="searchList.pageSize"
                      layout="total, prev, pager, next, jumper"
                      :total="searchList.total">
                  </el-pagination>
                </div>
              </template>
            </w-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
import menuMixin from '@/components/mixins/menu_mixin.js'
import API from '@/assets/js/api/api.js'
import Charts from '@/assets/js/components/chartsFun.js'
import WDropdown from '@/components/common/WDropdown.vue'
import WTitle from '@/components/common/WTitle.vue'
import WProgressBar from '@/components/common/WProgressBar.vue'
import WTable from '@/components/common/WTable.vue'
export default {
  mixins: [menuMixin],
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-resourceSupervision',
        name: '资源监管'
      }, {
        iconClass: 'iconfont icon-resource_load-management',
        name: '资源分配'
      }],
      currentRegionProvider: { // 当前资源池
        name: '-',
        id: '-',
        tenantLength: 0,
        providerName: '-',
        resourceRate: 0.4,
        capacityStatus: '充足',
        cpu: 0,
        cpuRate: 0,
        memory: 0,
        memoryRate: 0,
        storage: 0,
        storageRate: 0,
        list: [
          {
            label: '云主机',
            text: '301个'
          }
        ]
      },
      itemlist: [{
        name: '互联网资源池-移动',
        id: '1d00a0ba-3ee6-11e8-9e3f-00e0ed433b66'
      }, {
        name: '互联网资源池-联通',
        id: '1d00a2c3-3ee6-11e8-9e3f-00e0ed433b66'
      }],
      top5List: [],
      showDropDown: false,
      placeholder: '请输入资源池',
      nodatatext: '暂无数据',
      deviceList: [
        {
          name: '计算服务器',
          count: 10,
          status: 1
        }, {
          name: '存储服务器',
          count: 10,
          status: 1
        }, {
          name: '存储设备',
          count: 10,
          status: 1
        }, {
          name: '网络设备',
          count: 10,
          status: 1
        }, {
          name: '安全设备',
          count: 10,
          status: 0
        }
      ],
      // table
      tableList: [],
      searchList: {
        resourcePoolId: '', // 对应 regionProviderId
        orderField: 'orgId', // orgId
        orderFieldType: '', // ASC DESC
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    WDropdown,
    WTitle,
    WProgressBar,
    WTable
  },
  beforeCreate () {
    if (this.$store.state.userInfo.roleLevel == 3) {
      this.$router.push({path: '/resource/distribution/detail'})
    }
  },
  directives: {

  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getRegionList()
    },
    itemClickHandle: function (data) {
      let vm = this
      vm.showDropDown = false
      this.currentRegionProvider.name = data.name
      this.currentRegionProvider.id = data.id
      this.getOrgResFreeTop(this.currentRegionProvider.id)
      this.searchList.resourcePoolId = data.id
      this.currentRegionProvider.tenantLength = data.tenantList.length
      this.getOrgResAllocateDetail(this.searchList)
      this.getResCapacityConfigPool({
                poolId: this.currentRegionProvider.id
              })
    },
    clearEcharts: function (id) {
      if (Charts(id).echartObj) {
        Charts(id).echartObj.clear()
      }
    },
    initTOp5Bar: function () {
      let noData = false
      if (!this.top5List.xValue.length) {
        noData = true
      }
      this.clearEcharts('top5')
      $('#top5').removeClass('nodata-all')

      Charts.initBar({
        id: 'top5',
        barWidth: '10%',
        options: {
          tooltip: {
            formatter: function (params) {
              let str = ''
              let i
              let unitMap = {
                0: '核',
                1: 'GB',
                2: 'GB'
              }
              if (params instanceof Array) {
                str = params[0].name + '<br />'
                for (i = 0; i < params.length; i++) {
                  str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
                        params[i].color + '"></span>' + params[i].seriesName + ': ' +
                        params[i].value + ' ' + unitMap[i] + '<br />'
                }
              }
              return str
            }
          },
          yAxis: [
            {
              type: 'value',
              name: 'CPU',
              min: 0,
              max: 'dataMax',
              position: 'left',
              show: false
            },
            {
              type: 'value',
              name: '云存储',
              min: 0,
              position: 'right',
              show: false
            },
            {
              type: 'value',
              name: '内存',
              min: 0,
              position: 'right',
              show: false
            }
          ],
          xAxis: {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            yAxisIndex: 0
          }, {
            yAxisIndex: 1
          }, {
            yAxisIndex: 2
          }]
        },
        data: noData ? 'nodata' : this.top5List,
        color: ['#2196F3', '#3DCB77', '#BAA0E9']
      })
    },
    currentChangeFn: function (params) {
      console.log(params)
    },
    sortChangeFn: function (params) {
      console.log(params)
    },
    getRegionList() {
      const self = this
      axios.all([this.getRegionProviderList()])
        .then(axios.spread(function(regionProviderList, poolList) {
          // first
          console.log('//网络(服务商)列表')
          if (regionProviderList.status == 200 && regionProviderList.statusText == 'OK') {
            regionProviderList = regionProviderList.data.body
            console.log(regionProviderList)
            if (regionProviderList.length) {
              self.itemlist = regionProviderList
              self.itemlist.forEach((val, i) => {
                val.name = val.regionProviderName // dropDown依赖数据
                val.id = val.regionProviderId // dropDown依赖数据
              })
              // 初始化init，模拟click事件
              self.currentRegionProvider.name = self.itemlist[0].name
              self.currentRegionProvider.id = self.itemlist[0].id
              self.currentRegionProvider.tenantLength = self.itemlist[0].tenantList.length
              self.getOrgResFreeTop(self.currentRegionProvider.id)
              self.getOrgResAllocateDetail(self.searchList)
              self.getResCapacityConfigPool({
                poolId: self.currentRegionProvider.id
              })
              self.getResVirtualOverview(self.currentRegionProvider.id)
            }
          }
        }))
    },
    // 网络(服务商)列表
    getRegionProviderList () {
      return API.getRegionProviderList(this)
    },
    // 资源池容量配置详情信息
    getResCapacityConfigPool (params) {
      API.getResCapacityConfigPool(this, params)
        .then((res) => {
          // second
          console.log('//资源池容量配置详情信息')
          console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            if(!res.length){
              // mock
              res = [
                  {
                    "capacityStatus": "1",
                    "capacityStatusCn": "充足",
                    "cpu": 4,
                    "cpuRate": 0.4,
                    "id": 12312312,
                    "memory": 40,
                    "memoryRate": 0.4,
                    "name": "instance-04",
                    "providerId": 123,
                    "providerName": "移动",
                    "resourceRate": Math.random(),
                    "storage": 400,
                    "storageRate": 0.4
                  }
                ]
            }
            this.currentRegionProvider.providerName = res[0].providerName
            this.currentRegionProvider.resourceRate = res[0].resourceRate
            this.currentRegionProvider.capacityStatusCn = res[0].capacityStatusCn

            this.currentRegionProvider.cpu = res[0].cpu
            this.currentRegionProvider.cpuRate = res[0].cpuRate
            this.currentRegionProvider.memory = res[0].memory
            this.currentRegionProvider.memoryRate = res[0].memoryRate
            this.currentRegionProvider.storage = res[0].storage
            this.currentRegionProvider.storageRate = res[0].storageRate
          }
        })
    },
    // 查询虚拟资源统计信息
    getResVirtualOverview (regionProviderId) {
      API.getResVirtualOverview(this, {
        poolId: regionProviderId
      })
        .then((res) => {
          console.log('查询虚拟资源统计信息')
          console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            let dicNameMap = {
              'totalInstance': '云主机总数',
              'totalFw': '云防火墙总数',
              'totalLb': '负载均衡总数',
              'totalVolume': '云硬盘总数',
              'totalCpu': '总CPU数量',
              'totalMemory': '总内存数量',
              'totalStorage': '总云存储数量'
            }
            let result = []
            let unit = '个'
            // this.currentRegionProvider.list = []
            Object.keys(dicNameMap).forEach((val, i) => {
              result.push({
                label: dicNameMap[val],
                text: res[val] + unit
              })
            })
            this.currentRegionProvider.list = result
          }
        })
    },
    // 部门资源分配较多top5
    getOrgResFreeTop (regionProviderId) {
      API.getOrgResFreeTop(this, {
        resourcePoolId: regionProviderId
      })
        .then((res) => {
          // console.log('部门资源分配较多top5')
          // console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            if (res.length) {
            // 真实数据
              console.log('top5有数据')
            } else {
              // mock 数据
              res = [
                {
                  'cpuCount': Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                  'cpuUsed': 30,
                  'memoryCount': Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                  'memoryUsed': 320,
                  'orgId': 'fdfsadf',
                  'orgName': '办公厅',
                  'storageCount': Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                  'storageUsed': 2.3
                },
                {
                  'cpuCount': 60,
                  'cpuUsed': 30,
                  'memoryCount': 640,
                  'memoryUsed': 320,
                  'orgId': 'df22-df',
                  'orgName': '财政厅',
                  'storageCount': 5,
                  'storageUsed': 2.3
                },
                {
                  'cpuCount': 60,
                  'cpuUsed': 30,
                  'memoryCount': 640,
                  'memoryUsed': 320,
                  'orgId': 1,
                  'orgName': '林业局',
                  'storageCount': 5,
                  'storageUsed': 2.3
                },
                {
                  'cpuCount': 60,
                  'cpuUsed': 30,
                  'memoryCount': 640,
                  'memoryUsed': 320,
                  'orgId': 1,
                  'orgName': 'xx局',
                  'storageCount': 5,
                  'storageUsed': 2.3
                },
                {
                  'cpuCount': 60,
                  'cpuUsed': 30,
                  'memoryCount': 640,
                  'memoryUsed': 320,
                  'orgId': 1,
                  'orgName': 'yy局',
                  'storageCount': 5,
                  'storageUsed': 2.3
                }
              ]
              this.top5List = {
                xValue: [],
                value: [
                  {
                    name: 'CPU',
                    data: []
                  },
                  {
                    name: '内存',
                    data: []
                  },
                  {
                    name: '云存储',
                    data: []
                  }
                ]
              }
              let [xValue, cpuData, memoryData, storageData] = [[], [], [], []]
              res.forEach((val, i) => {
                xValue.push(val.orgName)
                cpuData.push(val.cpuCount)
                memoryData.push(val.memoryCount)
                storageData.push(val.storageCount)
              })
              this.top5List.xValue = xValue
              this.top5List.value[0].data = cpuData
              this.top5List.value[1].data = memoryData
              this.top5List.value[2].data = storageData
              this.initTOp5Bar()
            }
          }
        })
    },
    // 查询部门资源配置分配详情
    // {
    //   resourcePoolId: '', // 对应 regionProviderId
    //   orderField: 'orgId',
    //   orderFieldType: 'ASC',
    //   page: '1',
    //   pageSize: '10'
    // }
    getOrgResAllocateDetail (params) {
      API.getOrgResAllocateDetail(this, params)
        .then((res) => {
          // console.log('查询部门资源配置分配详情')
          // console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            // console.log(res)
            this.searchList.page = res.page
            this.searchList.pageSize = res.pageSize
            this.searchList.total = res.total
            this.tableList = res.data
            if (res.data.length) {
              // table有数据
            } else {
              // mock数据
              let mock = [
                {
                  'cpu': Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                  'instance': Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                  'memory': 640,
                  'orgId': 1,
                  'orgName': '办公厅',
                  'status': 10 * Math.random() > 5 ? 1 : 0,
                  'storage': 10
                },
                {
                  'cpu': 40,
                  'instance': 10,
                  'memory': 640,
                  'orgId': 2,
                  'orgName': '财政厅',
                  'status': 10 * Math.random() > 5 ? 1 : 0,
                  'storage': 10
                }
              ]
              this.tableList = mock
            }
          }
        })
    },
    // 页面转换使用
    switchString(data, unit = '%') {
      return '已使用' + data + unit
    },
    switchClassName({value, sort = 1, isColor = false}) {
      let className = 'good'
      let color = '#aab6a5'
      if (value > 80) {
        if (sort == 1) {
          className = 'good'
          color = '#67c23a'
        } else {
          className = 'bad'
          color = '#e62b2d'
        }
      } else if (value < 60) {
        if (sort == 1) {
          className = 'bad'
          color = '#e62b2d'
        } else {
          className = 'good'
          color = '#67c23a'
        }
      } else {
        className = 'normal'
        color = '#ffb438'
      }
      if (isColor) return color
      return className
    }
  },
  mounted() {
    if (this.$store.state.userInfo.roleLevel == 1 || this.$store.state.userInfo.roleLevel == 2) {
      let vm = this
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
        let $this = $(this)
        let dropdown = $this.next('.vue-dropdown')
        vm.showDropDown = !vm.showDropDown
        $this.find('.page-portrait-icon')
          .toggleClass('icon-triangle-bottom icon-triangle-top')
      })
    }
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
  $green:#3ECB77;
  $darkGray:#A9A9A9;
  $gray:#eee;
  $lightBlue:#70C0FF;
  $abnormalColor:#EF8888;

  * /deep/{
    .label-btn {
      font-size: 12px;
    }

    .label-btn.normal,
    .label-btn.enough {
      background: $green;
    }

    .label-btn.abnormal,
    .label-btn.shortage,
    .label-btn.high {
      background: $red;
    }

    .label-btn.busy {
      background:#cc0000;
    }

    .label-btn.idle {
      background: $blue;
    }
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

    .nav-content__detail {
      width:90%;
      margin: 0 auto;
    }

    .nav-content__basicinfo {
      margin-top: 0.5em;
      margin-bottom: 1.5em;
      color:#A9A9A9;
      & > span {
        float: right;
      }
    }

    .nav-content__reslist {
      margin-top:2em;
      li {
        padding: 0.5em 1em;
        margin-bottom: 0.25em;
        background: #eee;
        span {
          float: right;
        }
      }
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

  .echarts-content {
    height: 230px;
  }

  .a_link {
    text-decoration: none;
    &.to_detail{
      color: $lightBlue;
      &:visited {
        color: $lightBlue;
      }
    }

    &.to_abnormal {
      color:$abnormalColor;
      &:visited {
        color: $abnormalColor;
      }
    }
  }

</style>
