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
                    <div class="data-icon" v-show="false">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-vm-shortage"></use>
                      </svg>
                    </div>
                    <div class="data-icon" v-show="true">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-vm-abundant"></use>
                      </svg>
                    </div>
                    <div class="data-status">
                      <span class="_fix label-btn" :class="{enough:true}">充足</span>
                      <p>剩余容量</p>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="data-icon"><span class="pageIconFont icon-vm ft-30"></span></div>
                    <div class="data-status">
                      <span class="normal-number ft-12"><span class="ft-20" v-num-animation="10">10</span>个</span>
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
                      <span class="normal-number ft-12"><span class="ft-20" v-num-animation="10">10</span>个</span>
                      <p>配置过高云主机</p>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="data-icon"><span class="pageIconFont icon-low-deploy-vm ft-30"></span></div>
                    <div class="data-status">
                      <span class="normal-number ft-12"><span class="ft-20" v-num-animation="10">10</span>个</span>
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
                  <div class="table-cell">
                    <div class="data-icon"><span class="pageIconFont icon-respool ft-30"></span></div>
                    <div class="data-status">
                      <span class="abnormal-number ft-12" style="margin-right:0.5em;vertical-align:middle;"><span class="ft-20">98</span>%</span>
                      <span class="label-btn" :class="{enough:true}">高</span>
                      <p>互联网资源池</p>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="data-icon"><span class="pageIconFont icon-respool ft-30"></span></div>
                    <div class="data-status">
                      <span class="abnormal-number ft-12" style="margin-right:0.5em;vertical-align:middle;"><span class="ft-20">98</span>%</span>
                      <span class="label-btn" :class="{enough:true}">高</span>
                      <p>政务外网资源池</p>
                    </div>
                  </div>
                </div>
              </div>
            </w-row>
          </div>
        </div>
        <div class="mt15">
          <w-row>
            <template slot="title">互联网资源池容量</template>
            <div slot="content">
              <div class="table-block table-column-4">
                <div class="table-cell respool-module capacity">
                  <h3>CPU</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right">4/32<i>核</i></span>
                  </p>
                  <el-progress :percentage="80" color="#8e71c7" :show-text="false"></el-progress>
                </div>
                <div class="table-cell respool-module capacity">
                  <h3>CPU</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right">4/32<i>核</i></span>
                  </p>
                  <el-progress :percentage="80" color="#8e71c7" :show-text="false"></el-progress>
                </div>
                <div class="table-cell respool-module capacity">
                  <h3>CPU</h3>
                  <p class="clearfix">
                    <label>已使用/总量</label>
                    <span class="normal-number right">4/32<i>核</i></span>
                  </p>
                  <el-progress :percentage="80" color="#8e71c7" :show-text="false"></el-progress>
                </div>
                <div class="table-cell"></div>
              </div>
            </div>
          </w-row>
          <w-row>
            <template slot="title">互联网资源池负载</template>
            <div slot="content">
              <div class="table-block table-column-4">
                <div class="table-cell respool-module load">
                  <p class="clearfix">
                    <label>计算器服务</label>
                    <span class="normal-number ft-20 right">98<i>%</i></span>
                  </p>
                  <p class="clearfix ft-12">
                    <span class="label-btn middle">当前负载正常</span>
                    <span class="right">(比昨日↑5%)</span>
                  </p>
                </div>
                <div class="table-cell respool-module load"></div>
                <div class="table-cell respool-module load"></div>
                <div class="table-cell respool-module load"></div>
              </div>
            </div>
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
      ]
    }
  },
  methods: {
    toPage (url) {
      this.$store.commit('swtichRouter', url)
    }
  },
  directives: {
    'num-animation': function (el, binding) {
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

  .label-btn.enough{
    background: $color-success;
  }

  .label-btn.shortage{
    background: $color-danger;
  }

  .label-btn.high{
    background: $color-danger;
  }

  .label-btn.middle{
    background: $color-success;
  }

  .label-btn.low{
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
