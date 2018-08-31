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
                <span>当前负载：<span class="label-btn" :class="{normal:true}">正常</span></span>
              </div>
              <h3 style="margin-bottom:1em;font-size:14px;font-weight:normal;">物理资源情况</h3>
              <ul class="nav-content__reslist">
                <li>
                  物理内核
                  <span>10个</span>
                </li>
                <li>
                  物理内存
                  <span>200GB</span>
                </li>
                <li>
                  物理存储
                  <span>300TB</span>
                </li>
              </ul>
              <h3 style="margin-bottom:1em;margin-top:1.5em;font-size:14px;font-weight:normal;">物理设备</h3>
              <ul class="device-list">
                <li class="clearfix text-overflow__style" v-for="(item,index) in deviceList" :key="index" @click="deviceItemClick(item,$event)">
                  <span class="pageIconFont icon-webpage"></span>
                  <span class="device-item-text">{{item.name}}</span>
                  <span class="device-item-num">{{item.count}}台</span>
                  <span class="label-btn high fr" style="margin-top:1%;" v-if="item.status == 0">高负载</span>
                </li>
              </ul>
              <div v-show="!deviceList.length">暂无数据!</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="whiteBg" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="content-header">
            <label>计算服务器</label><span class="content-header-text__gray">共:1台</span><span class="label-btn high">高负载1台</span>
          </div>
          <w-title>CPU负载(周)</w-title>
          <div class="echarts-container">
            <div id="line1" class="echarts-content" v-echarts-line="lineData"></div>
          </div>
          <w-title>内存利用率(周)</w-title>
          <div class="echarts-container">
            <div id="line2" class="echarts-content" v-echarts-line="lineData"></div>
          </div>
          <w-title>磁盘活动时间</w-title>
          <div class="echarts-container">
            <div id="line3" class="echarts-content" v-echarts-line="lineData"></div>
          </div>
          <w-title>磁盘读写率</w-title>
          <div class="echarts-container">
            <div id="line4" class="echarts-content" v-echarts-line="lineData"></div>
          </div>
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

export default {
  mixins: [menuMixin],
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-resourceSupervision',
        name: '资源监管'
      }, {
        iconClass: 'iconfont icon-resource_load-management',
        name: '资源负载'
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
      lineData: {
        'xValue': ['周四', '周五', '周六', '周日', '周一', '周二'],
        'value': [{'name': 'CPU负载', 'data': [1.5, 2, 1.3, 1.65, 0.65, 0.75]}]
      }
    }
  },
  components: {
    WDropdown,
    WTitle
  },
  directives: {
    'echarts-line': {
      'inserted': function (el, binding, vnode) {
        let data = binding.value,
          id = el.id,
          unit = el.getAttribute('data-unit')

        if (!data) {
          data = 'nodata'
        }
        vnode.context.clearEcharts(id)
        Charts.initLine({
          id: id,
          unit: unit || ' ',
          opacity: 0,
          options: {
            grid: {
              top: '20%',
              bottom: '5%'
            },
            legend: {
              show: false
            },
            series: [{
              markPoint: {
                label: {
                  formatter: '{b}'
                },
                data: [
                  {type: 'max', name: '最高值'},
                  {type: 'min', name: '最低值'}
                ]
              },
              markLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: '#FF3B2F'
                },
                label: {
                  formatter: '{b}:{c}',
                  position: 'middle'
                },
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            }]
          },
          data: data
        })
      }
    }
  },
  methods: {
    itemClickHandle: function (data) {
      let vm = this
      vm.showDropDown = false
      console.log(data)
    },
    deviceItemClick: function (item, event) {
      if (event.target.localName == 'li') {
        $(event.target).siblings().removeClass('active')
          .end().addClass('active')
      } else if (event.target.localName == 'span') {
        $(event.target).parent().siblings().removeClass('active')
          .end().addClass('active')
      }
      console.log('item click')
    },
    clearEcharts: function (id) {
      if (Charts(id).echartObj) {
        Charts(id).echartObj.clear()
      }
    }
  },
  mounted: function () {
    let vm = this
    vm.itemlist = [{
      name: '互联网资源池-移动',
      id: '1d00a0ba-3ee6-11e8-9e3f-00e0ed433b66'
    }, {
      name: '互联网资源池-联通',
      id: '1d00a2c3-3ee6-11e8-9e3f-00e0ed433b66'
    }]

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

    $('.device-list').find('li').first().trigger('click')
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

  * /deep/{
    .label-btn {
      font-size: 12px;
    }

    .label-btn.normal {
      background: $green;
    }

    .label-btn.abnormal,
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

  .device-list {
    li {
      position: relative;
      margin-top: 0.5em;
      padding: 0.5em;
      border: 1px solid #ccc;
      white-space: nowrap;
      &>span {
        display: inline-block;
        vertical-align: middle;
      }
      .device-item-text {
        margin-right: 0.5em;
      }
      .device-item-num {
        float: right;
        margin-left: 0.5em;
        margin-top:1%;
      }

      &.active {
        border-color: #00a0e9;
        color: #00a0e9;
      }

      &:hover {
        border-color: #00a0e9;
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

</style>
