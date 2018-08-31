<template>
  <div>
    <el-row :gutter="15" style="overflow:hidden;">
      <el-col :span="6">
        <div class="nav__container whiteBg" v-init-screen-h="125" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="nav-logo"><span class="pageIconFont icon-respool"></span></div>
          <div class="nav-content">
            <h1 class="page-portrait" id="chooseBtn">
              互联网资源池-移动
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
                服务商：移动-华三
                <span>容量状态：<span class="label-btn" :class="{normal:true}">充足</span></span>
              </div>
              <w-progress-bar style="margin-bottom:4em;"
              label="物理资源利用率"
              text="已利用80%"
              :percentage="80"
              :height="20"
              color="#3DCB77"></w-progress-bar>
              <h3 style="margin-bottom:1.5em;font-size:14px;" v-show="progressBars.length">虚拟资源分配情况</h3>
              <w-progress-bar v-for="(item,index) in progressBars" :key="index"
              :label="item.label"
              :text="item.text"
              :percentage="item.percentage"
              :height="item.height"
              :color="item.color"
              :showpercent="true"></w-progress-bar>
              <ul class="nav-content__reslist">
                <li v-for="(item,index) in list" :key="index">
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
            <label>互联网资源池</label><span class="content-header-text__gray">单位总数:5个</span>
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
                      @sort-change="sortChange"
                      style="width: 100%">
                      <el-table-column
                        type="index"
                        label="ID">
                      </el-table-column>
                      <el-table-column
                        sortable='custom'
                        prop="orgName"
                        label="单位">
                        <template slot-scope="scope">
                          <router-link :to="'/resource/distribution/detail/'+scope.row.orgId" class="a_link to_detail">
                            {{scope.row.orgName}}
                          </router-link>
                        </template>
                      </el-table-column>
                      <el-table-column
                        sortable="custom"
                        prop="host"
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
                        label="CPU核">
                      </el-table-column>
                      <el-table-column
                        sortable="custom"
                        prop="status"
                        label="容量状态">
                        <template slot-scope="scope">
                          <span v-if="scope.row.statusCode == 1" class="label-btn enough">{{scope.row.status}}</span>
                          <span v-else-if="scope.row.statusCode == 0"  class="label-btn shortage">{{scope.row.status}}</span>
                          <span v-else>未知</span>
                        </template>
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import menuMixin from '@/components/mixins/menu_mixin.js'
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
      itemlist: [],
      showDropDown: false,
      placeholder: '请输入资源池',
      nodatatext: '暂无数据',
      deviceList: [{
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
      }],
      progressBars: [{
        label: 'CPU',
        text: '已分配200个',
        percentage: 80,
        height: 20,
        color: '#3DCB77'
      }, {
        label: '内存',
        text: '已分配200GB',
        percentage: 80,
        height: 20,
        color: '#3DCB77'
      }, {
        label: '云存储',
        text: '已分配200GB',
        percentage: 80,
        height: 20,
        color: '#3DCB77'
      }],
      list: [{
        label: '云主机',
        text: '301个'
      }, {
        label: '云硬盘',
        text: '301个'
      }, {
        label: '云防火墙',
        text: '301个'
      }, {
        label: '负载均衡',
        text: '301个'
      }],
      tableList: [{
        orgName: '机构单位',
        memory: 100,
        storage: 100,
        cpu: 100,
        status: '充足',
        statusCode: 1
      }, {
        orgName: '机构单位1',
        memory: 100,
        storage: 100,
        cpu: 100,
        status: '不足',
        statusCode: 0
      }, {
        orgName: '机构单位2',
        memory: 100,
        storage: 100,
        cpu: 100,
        status: '-',
        statusCode: '-'
      }],
      total: 0,
      page: 1,
      pageSize: 10
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
  methods: {
    itemClickHandle: function (data) {
      let vm = this
      vm.showDropDown = false
      console.log(data)
    },
    clearEcharts: function (id) {
      if (Charts(id).echartObj) {
        Charts(id).echartObj.clear()
      }
    },
    initTOp5Bar: function () {
      let data = {
        'xValue': [
          '办公厅',
          '财政厅',
          '林业厅',
          '民政厅',
          '农业厅'
        ],
        'value': [
          {
            'name': 'CPU',
            'data': [
              112,
              12,
              32,
              22,
              100
            ]
          },
          {
            'name': '云存储',
            'data': [
              88888.55,
              2888.55,
              3888.55,
              888.55,
              788.55
            ]
          },
          {
            'name': '内存',
            'data': [
              200.54,
              1200.54,
              2200.54,
              300.54,
              400.54
            ]
          }
        ]
      }
      if (data == null) {
        data = 'nodata'
      }
      this.clearEcharts('top5')
      $('#top5').removeClass('nodata-all')

      Charts.initBar({
        id: 'top5',
        barWidth: '10%',
        options: {
          tooltip: {
            formatter: function (params) {
              var str = '', i, unitMap = {
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
        data: data,
        color: ['#2196F3', '#3DCB77', '#BAA0E9']
      })
    },
    currentChange: function () {},
    sortChange: function (params) {
      console.log(params)
    }
  },
  mounted: function () {
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
        let $this = $(this),
          dropdown = $this.next('.vue-dropdown')
        vm.showDropDown = !vm.showDropDown
        $this.find('.page-portrait-icon')
          .toggleClass('icon-triangle-bottom icon-triangle-top')
      })

      vm.itemlist = [{
        name: '互联网资源池-移动',
        id: '1d00a0ba-3ee6-11e8-9e3f-00e0ed433b66'
      }, {
        name: '互联网资源池-联通',
        id: '1d00a2c3-3ee6-11e8-9e3f-00e0ed433b66'
      }]

      vm.initTOp5Bar()
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
