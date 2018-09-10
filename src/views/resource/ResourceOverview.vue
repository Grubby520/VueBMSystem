<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="18">
        <div class="table-block table-column-3">
          <div class="table-cell" style="padding-right:15px;">
            <w-row>
              <template slot="title">容量预警</template>
              <div slot="content">
                <div class="table-block table-column-2">
                  <div class="table-cell">
                    <div class="data-icon" v-if="resCapacityPhy.capacityStatus == '不充足'">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-vm-shortage"></use>
                      </svg>
                    </div>
                    <div class="data-icon" v-else>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-vm-abundant"></use>
                      </svg>
                    </div>
                    <div class="data-status">
                      <span class="_fix label-btn" :class=" resCapacityPhy.capacityStatus === '充足' ? 'good' : 'bad' ">{{resCapacityPhy.capacityStatus}}</span>
                      <p>剩余容量</p>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="data-icon"><span class="pageIconFont icon-vm ft-30"></span></div>
                    <div class="data-status">
                      <span class="normal-number ft-12"><span class="ft-20" v-num-animation="resCapacityPhy.allocatedVmQuantity">{{resCapacityPhy.allocatedVmQuantity}}</span>个</span>
                      <p>可分配云主机</p>
                    </div>
                  </div>
                </div>
              </div>
            </w-row>
          </div>
          <div class="table-cell" style="padding-right:15px;">
            <w-row>
              <template slot="title">分配预警</template>
              <div slot="content">
                <div class="table-block table-column-2">
                  <div class="table-cell">
                    <div class="data-icon"><span class="pageIconFont icon-warm-high ft-30"></span></div>
                    <div class="data-status">
                      <span class="normal-number ft-12"><span class="ft-20" v-num-animation="resInstanceStatistics.statusHighInstanceCount">{{resInstanceStatistics.statusHighInstanceCount}}</span>个</span>
                      <p>配置过高云主机</p>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="data-icon"><span class="pageIconFont icon-low-deploy-vm ft-30"></span></div>
                    <div class="data-status">
                      <span class="normal-number ft-12"><span class="ft-20" v-num-animation="resInstanceStatistics.statusLowInstanceCount">{{resInstanceStatistics.statusLowInstanceCount}}</span>个</span>
                      <p>配置过低云主机</p>
                    </div>
                  </div>
                </div>
              </div>
            </w-row>
          </div>
          <div class="table-cell">
            <w-row>
              <template slot="title">负载预警</template>
              <div slot="content">
                <div class="table-block table-column-2">
                  <div class="table-cell" v-for="item in resLoadPhyResList" :key="item.type">
                    <div v-if="item.type == 'inner'">
                      <div class="data-icon"><span class="pageIconFont icon-respool ft-30"></span></div>
                      <div class="data-status">
                        <span class="abnormal-number ft-12" style="margin-right:0.5em;vertical-align:middle;" :style="{color: item.color}"><span class="ft-20">{{parseInt(item.loadRate*100)}}</span>%</span>
                        <span class="label-btn" :class="item.className">{{item.loadEvaluation}}</span>
                        <p>互联网资源池</p>
                      </div>
                    </div>
                    <div v-else-if="item.type == 'external'">
                      <div class="data-icon"><span class="pageIconFont icon-respool ft-30"></span></div>
                      <div class="data-status">
                        <span class="abnormal-number ft-12" style="margin-right:0.5em;vertical-align:middle;" :style="{color: item.color}"><span class="ft-20">{{parseInt(item.loadRate*100)}}</span>%</span>
                        <span class="label-btn" :class="item.className">{{item.loadEvaluation}}</span>
                        <p>政务外网资源池</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </w-row>
          </div>
        </div>
        <div class="mt15" v-if="baseRegionList.inner">
          <w-row>
            <template slot="title">互联网资源池容量</template>
            <div slot="content" v-for="item in baseRegionList.capacityPoolList" :key='item.regionType'>
              <div class="table-block table-column-4" v-if="item.regionType == 'inner'">
                <div class="table-cell respool-module capacity">
                  <h3>CPU</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right" :style="{color: item.cpuClassName}">{{item.cpuUsed}}/{{item.cpu}}<i>核</i></span>
                  </p>
                  <el-progress :percentage="parseInt(100*item.cpuRate)" :color="item.cpuClassName" :show-text="false"></el-progress>
                </div>
                <div class="table-cell respool-module capacity">
                  <h3>内存</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right" :style="{color: item.memoryClassName}">{{item.memoryUsed}}/{{item.memory}}<i>核</i></span>
                  </p>
                  <el-progress :percentage="parseInt(100*item.memoryRate)" :color="item.memoryClassName" :show-text="false"></el-progress>
                </div>
                <div class="table-cell respool-module capacity">
                  <h3>存储</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right" :style="{color: item.storageClassName}">{{item.memoryUsed}}/{{item.storage}}<i>核</i></span>
                  </p>
                  <el-progress :percentage="parseInt(100*item.storageRate)" :color="item.storageClassName" :show-text="false"></el-progress>
                </div>
                <div class="table-cell"></div>
              </div>
            </div>
          </w-row>
          <w-row>
            <template slot="title">互联网资源池负载</template>
            <div slot="content" v-for="item in netAreaResPool" :key='item.regionType'>
              <div class="table-block table-column-4" v-if="item.regionType == 'inner'">
                <div v-for="inner in item.data" :key='inner.name'>
                  <div class="table-cell respool-module load" v-if="inner.name = 'service'">
                    <p class="clearfix">
                      <label>计算器服务</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div>
                  <!-- <div class="table-cell respool-module load" v-if="inner.name = 'storage'">
                    <p class="clearfix">
                      <label>存储服务器</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div>
                  <div class="table-cell respool-module load" v-if="inner.name = 'device'">
                    <p class="clearfix">
                      <label>存储设备</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div>
                  <div class="table-cell respool-module load" v-if="inner.name = 'network'">
                    <p class="clearfix">
                      <label>网络出口宽带</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div> -->
                </div>
              </div>
            </div>
          </w-row>
        </div>
        <div class="mt15" v-if="baseRegionList.external">
          <w-row>
            <template slot="title">政务外网资源池容量</template>
            <div slot="content" v-for="item in baseRegionList.capacityPoolList" :key='item.regionType'>
              <div class="table-block table-column-4" v-if="item.regionType == 'external'">
                <div class="table-cell respool-module capacity">
                  <h3>CPU</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right" :style="{color: item.cpuClassName}">{{item.cpuUsed}}/{{item.cpu}}<i>核</i></span>
                  </p>
                  <el-progress :percentage="parseInt(100*item.cpuRate)" :color="item.cpuClassName" :show-text="false"></el-progress>
                </div>
                <div class="table-cell respool-module capacity">
                  <h3>内存</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right" :style="{color: item.memoryClassName}">{{item.memoryUsed}}/{{item.memory}}<i>核</i></span>
                  </p>
                  <el-progress :percentage="parseInt(100*item.memoryRate)" :color="item.memoryClassName" :show-text="false"></el-progress>
                </div>
                <div class="table-cell respool-module capacity">
                  <h3>存储</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right" :style="{color: item.storageClassName}">{{item.memoryUsed}}/{{item.storage}}<i>核</i></span>
                  </p>
                  <el-progress :percentage="parseInt(100*item.storageRate)" :color="item.storageClassName" :show-text="false"></el-progress>
                </div>
                <div class="table-cell"></div>
              </div>
            </div>
          </w-row>
          <w-row>
            <template slot="title">政务外网资源池负载</template>
            <!-- <div slot="content" v-for="item in netAreaResPool" :key='item.regionType'>
              <div class="table-block table-column-4" v-if="item.regionType == 'external'">
                <div v-for="inner in item.data" :key='inner.name'>
                  <div class="table-cell respool-module load" v-if="inner.name = 'service'">
                    <p class="clearfix">
                      <label>计算器服务</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div>
                  <div class="table-cell respool-module load" v-if="inner.name = 'storage'">
                    <p class="clearfix">
                      <label>存储服务器</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div>
                  <div class="table-cell respool-module load" v-if="inner.name = 'device'">
                    <p class="clearfix">
                      <label>存储设备</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div>
                  <div class="table-cell respool-module load" v-if="inner.name = 'network'">
                    <p class="clearfix">
                      <label>网络出口宽带</label>
                      <span class="normal-number ft-20 right">{{parseInt(inner.loadRate*100)}}<i>%</i></span>
                    </p>
                    <p class="clearfix ft-12">
                      <span class="label-btn middle">当前负载{{inner.loadEvaluation}}</span>
                      <span class="right">(比昨日{{inner.loadCompare}})</span>
                    </p>
                  </div>
                </div>
              </div>
            </div> -->
          </w-row>
        </div>
      </el-col>
      <el-col :span="6">
         <w-row>
          <template slot="title">我的资产</template>
          <div slot="content">
            <ul class="whiteBg assets-container" v-cloak>
              <li class="assets" v-for="(item,index) in assetsList" :key="index">
                <a @click="toPage(item.href)">
                  <div class="table-block">
                    <div class="table-cell table-v-center table-h-center assetsicon-con">
                      <span class="pageIconFont ft-30" :class="item.icon"></span>
                    </div>
                    <div class="table-cell table-v-center">
                      <h3 class="ft-14">{{item.name}}</h3>
                      <p class="">
                        <span class="number-wrap ft-12">共<span class="normal-number ft-20" v-num-animation="item.normalNum">{{item.normalNum | exceptionFilter}}</span>台</span>
                        <span class="number-wrap ft-12"><span class="abnormal-number ft-20" v-num-animation="item.normalNum">{{item.abnormalNum | exceptionFilter}}</span>台异常</span>
                      </p>
                    </div>
                  </div>
                </a>
              </li>
              <li class="empty-text" v-show="assetsList.length == 0">暂无数据</li>
            </ul>
          </div>
         </w-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import CountUp from '@/assets/js/lib/countUp-1.9.3.js'
import menuMixin from '@/components/mixins/menu_mixin.js'
import WRow from '@/components/common/WRow.vue'
import WProgressBar from '@/components/common/WProgressBar.vue'
import API from '@/assets/js/api/api.js'
export default {
  mixins: [menuMixin],
  components: {
    WRow,
    WProgressBar
  },
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-resourceSupervision',
        name: '资源监管'
      }, {
        iconClass: 'iconfont icon-resouce_overview-management',
        name: '资源概览'
      }],
      resCapacityPhy: {
        allocatedVmQuantity: 0,
        capacityStatus: '充足'
      },
      resInstanceStatistics: {
        statusHighInstanceCount: 0,
        statusLowInstanceCount: 0
      },
      resLoadPhyResList: [
        {
          loadEvaluation: '高',
          loadRate: '0.86',
          className: 'bad',
          name: '互联网资源池',
          type: 'inner'
        },
        {
          loadEvaluation: '中',
          loadRate: '0.62',
          className: 'normal',
          name: '政务外网资源池',
          type: 'external'
        }
      ],
      assetsList: [
        {
          code: '',
          name: '服务器',
          normalNum: 100,
          abnormalNum: 10,
          href: '/resource/overview',
          icon: 'icon-device-server'
        }, {
          code: '',
          name: '网络设备',
          normalNum: 100,
          abnormalNum: 10,
          href: '/resource/overview',
          icon: 'icon-device-network'
        }, {
          code: '',
          name: '存储设备',
          normalNum: 100,
          abnormalNum: 10,
          href: '/resource/overview',
          icon: 'icon-device-storage'
        }, {
          code: '',
          name: '安全设备',
          normalNum: 100,
          abnormalNum: 10,
          href: '/resource/overview',
          icon: 'icon-device-safety'
        }
      ],
      baseRegionList: {
        inner: false,
        external: false,
        capacityPoolList: [
          {
            cpu: 20,
            cpuUsed: 10,
            cpuRate: 0.9,
            memory: 30,
            memoryUsed: 2,
            memoryRate: 0.9,
            storage: 60,
            storageUsed: 11,
            storageRate: 0.9,
            regionType: 'inner'
          },
          {
            cpu: 20,
            cpuUsed: 10,
            cpuRate: 0.9,
            memory: 30,
            memoryUsed: 2,
            memoryRate: 0.9,
            storage: 60,
            storageUsed: 11,
            storageRate: 0.9,
            regionType: 'external'
          }
        ]
      },
      netAreaResPool: [
        {
          'regionId': 'r-01',
          'regionName': '政务外网资源池',
          'regionType': 'inner',
          'data': [
            {
              'name': 'network',
              'loadRate': 0.32,
              'loadEvaluation': '低',
              'loadCompare': -0.6
            },
            {
              'name': 'storage',
              'loadRate': 0.52,
              'loadEvaluation': '高',
              'loadCompare': +0.4
            },
            {
              'name': 'service',
              'loadRate': 0.36,
              'loadEvaluation': '低',
              'loadCompare': -0.2
            },
            {
              'name': 'device',
              'loadRate': 0.32,
              'loadEvaluation': '低',
              'loadCompare': -0.2
            }
          ]
        },
        {
          'regionId': 'r-02',
          'regionName': '互联网资源池',
          'regionType': 'external',
          'data': [
            {
              'name': 'network',
              'loadRate': 0.32,
              'loadEvaluation': '低',
              'loadCompare': -0.6
            },
            {
              'name': 'storage',
              'loadRate': 0.52,
              'loadEvaluation': '高',
              'loadCompare': +0.4
            },
            {
              'name': 'service',
              'loadRate': 0.36,
              'loadEvaluation': '低',
              'loadCompare': -0.2
            },
            {
              'name': 'device',
              'loadRate': 0.32,
              'loadEvaluation': '低',
              'loadCompare': -0.2
            }
          ]
        }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init() {
      this.getResCapacityPhy()
      this.getResInstanceStatistics()
      this.getResLoadPhyResList()
      this.getResCapacityPhyOverview()
      this.getBaseRegionList()
      this.getResCapacityPoolList()
      this.getResLoadNetAreaResPool()
    },
    toPage (url) {
      this.$store.commit('swtichRouter', url)
    },
    // className转换
    switchClassName({value, sort = 1, isColor = false}) {
      let className = 'good'
      let color = '#aab6a5'
      if (value > 0.8) {
        if (sort == 1) {
          className = 'good'
          color = '#67c23a'
        } else {
          className = 'bad'
          color = '#e62b2d'
        }
      } else if (value < 0.6) {
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
      else return className
    },
    // 物理资源剩余容量信息
    getResCapacityPhy () {
      API.getResCapacityPhy(this)
        .then(res => {
          // console.log('//物理资源剩余容量信息')
          // console.log(res.data.body)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body[0]
            Object.keys(this.resCapacityPhy).forEach((val, i) => {
              this.resCapacityPhy[val] = res[val]
            })
          }
        })
    },
    // 查询云主机配置状态统计信息
    getResInstanceStatistics () {
      API.getResInstanceStatistics(this)
        .then(res => {
          // console.log('//查询云主机配置状态统计信息')
          // console.log(res)
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            Object.keys(this.resInstanceStatistics).forEach((val, i) => {
              this.resInstanceStatistics[val] = res[val]
            })
          }
        })
    },
    // 查询物理资源负载信息
    getResLoadPhyResList () {
      API.getResLoadPhyResList(this)
        .then(res => {
          // console.log('//查询物理资源负载信息')
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body.data
            // console.log(res)
            res.forEach((val, i) => {
              // 后端type字段暂未返回,先mock
              if (val.type == 'inner') {
                this.resLoadPhyResList[0].loadEvaluation = val.loadEvaluation
                this.resLoadPhyResList[0].loadRate = val.loadRate
                this.resLoadPhyResList[0].className = this.switchClassName({value: val.loadRate, sort: -1})
                this.resLoadPhyResList[0].color = this.switchClassName({value: val.loadRate, sort: -1, isColor: true})
              }
              if (val.type == 'external') {
                this.resLoadPhyResList[1].loadEvaluation = val.loadEvaluation
                this.resLoadPhyResList[1].loadRate = val.loadRate
                this.resLoadPhyResList[1].className = this.switchClassName({value: val.loadRate, sort: -1})
                this.resLoadPhyResList[1].color = this.switchClassName({value: val.loadRate, sort: -1, isColor: true})
              }
            })
          }
        })
    },
    // 物理设备容量统计信息
    getResCapacityPhyOverview () {
      API.getResCapacityPhyOverview(this)
        .then(res => {
          console.log('//物理设备容量统计信息')
          console.log(res)
        })
    },
    // 网络区域列表
    getBaseRegionList () {
      API.getBaseRegionList(this)
        .then(res => {
          // console.log('//网络区域列表')
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            // console.log(res)
            res.forEach((val, i) => {
              this.baseRegionList[val.regionEnName] = true
            })
          }
        })
    },
    // 资源池剩余容量信息
    getResCapacityPoolList () {
      API.getResCapacityPoolList(this, {
        statisticsBy: 'regionType',
        timeStart: '2018-08-10 00:00:00',
        timeEnd: '2018-09-10 00:00:00'
      })
        .then(res => {
          // console.log('//资源池剩余容量信息')
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body.data
            // console.log(res)
            res.forEach((val, i) => {
              val.cpuClassName = this.switchClassName({value: val.cpuRate, isColor: true, sort: -1})
              val.memoryClassName = this.switchClassName({value: val.memoryRate, isColor: true, sort: -1})
              val.storageClassName = this.switchClassName({value: val.storageRate, isColor: true, sort: -1})
            })
            this.baseRegionList.capacityPoolList = res
          }
        })
    },
    // 网络区域资源池负载信息
    getResLoadNetAreaResPool () {
      API.getResLoadNetAreaResPool(this)
        .then(res => {
          console.log('//网络区域资源池负载信息')
          if (res.status == 200 && res.statusText == 'OK') {
            res = res.data.body
            console.log(res)
          }
        })
    }
  },
  directives: {
    'num-animation': function (el, binding) {
      let num = parseFloat(binding.value)
      let numStr = String(num)
      if (!isNaN(num)) {
        let decNumber = 0
        if (numStr.split('.')[1]) {
          decNumber = numStr.split('.')[1].length > 2 ? 2 : numStr.split('.')[1].length
        }
        new CountUp(el, 0, num, decNumber, 2.5).start()
      }
    }
  },
  filters: {
    exceptionFilter: function (value) {
      if (!value && value != 0) {
        value = '?'
      }
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/component/_var.scss';
  @import '@/assets/scss/component/_layout.scss';
  @import '@/assets/scss/element_layout_init.scss';
  $fontDefautSize:10px;
  $percent100:100%;

  * /deep/ .el-progress-bar__outer {
    width: 100%;
  }

  i {
    font-style: normal;
  }

  .ft-12 {
    font-size: 1.2*$fontDefautSize;
  }

  .ft-14 {
    font-size: 1.4*$fontDefautSize;
  }

  .ft-20 {
    font-size: 2*$fontDefautSize;
  }

  .ft-30 {
    font-size: 3*$fontDefautSize;
  }

  .label-btn {
    border-radius: 10px;
  }

  .label-btn.enough, .good{
    background: $color-success;
  }

  .label-btn.shortage{
    background: $color-danger;
  }

  .label-btn.high, .bad{
    background: $color-danger;
  }

  .label-btn.middle{
    background: $color-success;
  }

  .label-btn.low, .normal{
    background: $color-warning;
  }

  .normal-number {
    color: $color-success;
  }

  .abnormal-number {
    color: $color-danger;
  }

  .table-block {
    color: #333;
    width: 100%;
  }
  .table-column-4 .table-cell {
    width: $percent100/4;
  }
  .table-column-3 .table-cell {
    width: $percent100/3;
  }
  .table-column-2 .table-cell {
    width: $percent100/2;
  }

  .data-icon {
    width: 66px;
    height: 66px;
    line-height: 66px;
    margin: 0 auto;
    text-align: center;
    padding: 0.5em;
    border-radius: 100%;
    box-sizing: border-box;
    background: #f6f6f6;

    svg[class*='icon'] {
      font-size: 30px;
    }
  }

  .data-status {
    text-align: center;
    margin-top:20px;
    & > span {
      display: inline-block;
    }
    p{
      margin-top: 0.5em;
    }

    ._fix {
      margin-top: 10px;
    }
  }

  .respool-module {
    padding-right: 2em;
    &:last-child {
      padding-right: 0;
    }

    &.capacity {
      h3 {
        font-weight: normal;
        @extend .ft-14;
      }
      p {
        height: 24px;
        line-height: 24px;
        label {
          color: #a9a9a9;
        }
        span {
          @extend .ft-20;
          i {
            font-style: normal;
            @extend .ft-12;
          }
        }
      }
    }

    &.load {
      p:first-child {
        height: 30px;
        line-height: 30px;
      }
    }
  }

  /*资产模块样式*/
  .assets {
    height: 80px;
    background-color: #f6f6f6;
    margin-bottom: 1em;
    a {
      display: block;
      height: 100%;
      color:#555;
      text-decoration: none;
      &>div {
        height: 100%;
        width: 100%;
      }
    }
    h3 {
      margin: 0 0 0.5em 0;
      font-weight: normal;
    }

    .assetsicon-con {
      width: 35%;
    }

    .number-wrap {
      display: inline-block;
      &:last-child {
        position: relative;
        left: 25%;
      }
      span {
        display: inherit;
      }
    }

  }
</style>
