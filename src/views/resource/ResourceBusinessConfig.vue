<template>
  <div>
    <el-row :gutter="15" style="overflow:hidden;">
      <el-col :span="6">
        <app-list @click="itemClickHandle" :list="vmList" placeholder="请输入虚拟机名称" :orgName='orgName'>
        </app-list>
      </el-col>
      <el-col :span="18">
        <div class="whiteBg" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="content-header">
            <label>{{curBusinessName}}</label>
            <span v-if="runStatusTxt != ''" class="app-status"><img height="18px" width="18px" src="#springUrl('/images/images/prompt_box_warining.png')" alt="">负载{{runStatusTxt}}，需要优化！</span>
          </div>
          <div class="flex-layout" style="margin: 0 20px;">
             <div style="margin-right: 15px;" class="flex-layout flex-item-row flex-space-1 content-statistic-module">
               <h1>资源配置</h1>
               <div class="flex-layout flow-content">
                 <div class="flex-space-1">
                   <div class="flow-num" id="res-cpu">?</div>
                   <span class="flow-text">CPU(个)</span>
                 </div>
                 <div class="flex-space-1">
                   <div class="flow-num" id="res-rvm">?</div>
                   <span class="flow-text">内存(GB)</span>
                 </div>
                 <div class="flex-space-1">
                   <div class="flow-num" id="res-storage">?</div>
                   <span class="flow-text">储存(GB)</span>
                 </div>
               </div>
             </div>
             <div class="flex-layout flex-item-row flex-space-1 content-statistic-module">
               <h1>平均负载</h1>
               <div class="flex-layout flow-content">
                 <div class="flex-space-1">
                   <div class="flow-num normal" id="load-cpu">?</div>
                   <span class="flow-text">CPU
                     <span class="label-btn " :class="cpuStatus.sts" v-text="cpuStatus.txt">高</span>
                   </span>
                 </div>
                 <div class="flex-space-1">
                   <div class="flow-num danger" id="load-rvm">?</div>
                   <span class="flow-text">内存
                     <span class="label-btn high"  :class="memoryStatus.sts" v-text="memoryStatus.txt">高</span>
                   </span>
                 </div>
                 <div class="flex-space-1 warm">
                   <div class="flow-num" id="load-storage">?</div>
                   <span class="flow-text">储存
                     <span  class="label-btn " :class="storageStatus.sts" v-text="storageStatus.txt">高</span>
                   </span>
                 </div>
               </div>
             </div>
          </div>
          <div class="flex-layout" style="margin: 0 20px;">
             <div style="margin-right: 15px;" class="flex-layout flex-item-row flex-space-1 content-statistic-module">
               <h1>资源设备</h1>
               <router-link to="/resource/vm-config" tag="div" class="flex-layout flow-content resource">
                <div class="flex-space-1">
                  <div class="flow-num" id="vm-busy">?</div>
                  <span class="flow-text">高负载虚拟机（个）</span>
                </div>
                <div class="flex-space-1">
                  <div class="flow-num" id="vm-free">?</div>
                  <span class="flow-text">空闲虚拟机（个）</span>
                </div>
                <div class="flex-space-1">
                  <div class="flow-num" id="vm-normal">?</div>
                  <span class="flow-text">正常虚拟机（个）</span>
                </div>
               </router-link>
             </div>
             <div style="border:none" class="flex-layout flex-item-row flex-space-1 content-statistic-module">
             </div>
          </div>
          <w-row title="本月负载趋势">
            <template slot="info">
              <el-col :span="12">
                最大负载值：<span id="maxFlowNum"></span>
              </el-col>
              <el-col :span="12">
                最小负载值：<span id="minFlowNum"></span>
              </el-col>
            </template>
            <div slot="content">
              <div id="flowTrend"></div>
            </div>
          </w-row>
        </div>
      </el-col>
    </el-row>
    <w-dialog
      title="虚拟机配置仿真"
      :visible.sync="dialogVisible"
    >
      <w-form ref="form" :model="form" :rules="rules">
        <w-row
          title="请选择虚拟机规格"
        >
          <w-form-item name="vmType">
            <base-label class="large" value="231" style="margin-right:4px" :active = "true" :isRadius="false" :isPointer="true" @click="handleChoseClick" >fdas</base-label>
            <base-label class="large" value="231"  :isRadius="false" :isPointer="true" @click="handleChoseClick" >fdas</base-label>
          </w-form-item>
          <!-- <div  slot="content">
                    <base-input v-model="form.username" :is-radius="true" iconPreFix="icon-home_page-management iconfont" placeholder="请输入用户名" />
              <base-label class="large" value="231" style="margin-right:4px" :active = "true" :isRadius="false" :isPointer="true" @click="handleChoseClick" >fdas</base-label>
              <base-label class="large" value="231"  :isRadius="false" :isPointer="true" @click="handleChoseClick" >fdas</base-label>

          </div> -->
        </w-row>
        <w-row>
          <w-form-item name="diskValue" label="请选择磁盘大小">
            <!-- <base-input  v-model="form.diskValue"  placeholder="请输入磁盘大小" /> -->
            <w-select v-model="form.diskValue" :list="diskList" filterable >

            </w-select>
          </w-form-item>
        </w-row>

        <w-row title="仿真结果">
          <div slot="content"></div>
        </w-row>

      </w-form>
      <div slot="footer">
        <base-button  @click="dialogVisible = false">取消</base-button>
        <base-button @click="simulate('form')" type="primery" >开始仿真</base-button>
      </div>
    </w-dialog>
  </div>
</template>
<script>
import WForm from '@/components/common/form/WForm.vue'
import WSelect from '@/components/common/select/WSelect.vue'
import WFormItem from '@/components/common/form/WFormItem.vue'
import WRow from '@/components/common/WRow.vue'
import BaseLabel from '@/components/common/base/BaseLabel.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseInput from '@/components/common/base/BaseInput.vue'
import WDialog from '@/components/common/WDialog.vue'
import WLoading from '@/components/common/loading/index.js'
import AppList from './_AppList.vue'
import config_mixins from './config_mixins.js'
import menuMixin from '@/components/mixins/menu_mixin.js'
import emitter from '@/components/mixins/emitter.js'

export default {
  mixins: [config_mixins, emitter, menuMixin],
  data () {
    var _this = this
    return {
      crumbs: [{
        iconClass: 'iconfont icon-flow',
        name: '资源监管'
      }, {
        iconClass: 'iconfont icon-flow_overview-management',
        name: '容量分析'
      }],
      form: {
        vmType: '',
        diskValue: ''
      },
      rules: {
        vmType: [
          {
            validator (rule, value, callback) {
              if (!_this.form.vmType) {
                callback(new Error('请选择虚拟机规格'))
              } else {
                callback()
              }
            }
          }
        ],
        diskValue: [
          {
            validator (rule, value, callback) {
              if (value) {
                callback()
              } else {
                callback(new Error('请选择磁盘大小'))
              }
            }
          }
        ]
      },
      diskList: [
        {
          id: 2,
          name: 'dfas'
        }
      ],
      vmList: [{
        existExceptionFlow: null,
        id: '4fba5622-a306-4cd1-aa76-3d423d0674e4',
        name: 'net-test-business1测试',
        statusClass: '',
        statusText: ''
      }],
      orgName: '?',
      curBusinessName: '?',
      dialogVisible: false,
      runStatusTxt: '', // 运行状态
      businessName: '-',
      businessIp: '-',
      LastMonthLoad: {
        max: -1,
        maxTime: '-',
        min: 100,
        minTime: '-'
      },
      vmInfo: ''
    }
  },
  components: {
    WRow,
    BaseLabel,
    BaseButton,
    WDialog,
    BaseInput,
    AppList,
    WForm,
    WFormItem,
    WSelect
  },
  methods: {
    handleChoseClick (instance) { // 弹框
      console.log(instance)
      this.form.vmType = instance.isActive ? instance.$attrs.value : ''
      this.broadcast('WFormItem', 'formItem.blur')
      instance.$parent.$children.forEach((item) => {
        if (item._uid != instance._uid) {
          item.isActive = false
        }
      })
    },
    itemClickHandle: function (data, event) {
      this.clearTimerIdS('res-cpu', 'res-rvm', 'res-storage', 'load-cpu', 'load-rvm', 'load-storage')
      this.curBusinessName = data.name

      // 虚拟机详情
      // api.ajaxPost({
      //     url:'/resource/vm-config/businessInfo',
      //     data:{
      //         vmId:itemId
      //     }
      // }).then(function(data){
      //     data = JSON.parse(data.result);

      //     if(data.businessRunStatus == 'busy'){
      //         this.runStatusTxt = '高'
      //     }
      //     if(data.businessRunStatus == 'idle'){
      //         this.runStatusTxt = '低'
      //     }

      //     if(data.vmInfo){
      //         _this.businessName = data.vmInfo.name;
      //         _this.vmInfo  = data.vmInfo
      //         if(data.vmInfo.cpuNum >= 0){
      //             addNumAnim(new CountUp("res-cpu", 0,data.vmInfo.cpuNum, 0, 2.5));
      //         }else{
      //             $("#res-cpu").text('?');
      //         }
      //         if(data.vmInfo.memory >= 0){
      //             addNumAnim(new CountUp("res-rvm", 0,data.vmInfo.memory, 2, 2.5));
      //         }else{
      //             $("#res-rvm").text('?');
      //         }
      //         if(data.vmInfo.storage >= 0){
      //             addNumAnim(new CountUp("res-storage", 0,data.vmInfo.storage, 2, 2.5));
      //         }else{
      //             $("#res-storage").text('?');
      //         }
      //         if(data.vmInfo.cpuLoad >= 0){
      //             addNumAnim(new CountUp("load-cpu", 0,data.vmInfo.cpuLoad, 2, 2.5));
      //         }else{
      //             $("#load-cpu").text('?');
      //         }
      //         if(data.vmInfo.memoryLoad >= 0){
      //             addNumAnim(new CountUp("load-rvm", 0,data.vmInfo.memoryLoad, 2, 2.5));
      //         }else{
      //             $("#load-rvm").text('?');
      //         }
      //         if(data.vmInfo.storageLoad >= 0){
      //             addNumAnim(new CountUp("load-storage", 0,data.vmInfo.storageLoad, 2, 2.5));
      //         }else{
      //             $("#load-storage").text('?');
      //         }
      //     }

      //     //流量趋势(一个月)
      //     for(var i in data.LastMonthLoad){
      //         if(i == 'xabscissa') continue
      //         data.LastMonthLoad[i].forEach((item, index)=>{
      //             if(parseFloat(_this.LastMonthLoad.max) < parseFloat(item)*100){
      //                 _this.LastMonthLoad.max = parseFloat(item)*100
      //                 _this.LastMonthLoad.maxTime = data.LastMonthLoad.xabscissa[index]
      //             }
      //             if(parseFloat(_this.LastMonthLoad.min) > parseFloat(item)*100){
      //                 _this.LastMonthLoad.min = parseFloat(item)*100
      //                 _this.LastMonthLoad.minTime = data.LastMonthLoad.xabscissa[index]
      //             }
      //        })
      //     }

      //     Charts.initLine({
      //         id: 'flowTrend',
      //         unit:'%',
      //         data:{
      //             xValue:data.LastMonthLoad.xabscissa,
      //             value:[
      //                 {
      //                     name:'CPU',
      //                     data:data.LastMonthLoad.cpu
      //                 },
      //                 {
      //                     name:'内存',
      //                     data:data.LastMonthLoad.memory
      //                 },
      //                 {
      //                     name:'存储',
      //                     data:data.LastMonthLoad.storage
      //                 }
      //             ]
      //         },
      //         smooth:false,
      //         // options:{
      //         //     tooltip:{
      //         //         formatter:function(params){
      //         //             var str = '';
      //         //             if(params instanceof Array){
      //         //                 str = params[0].name+'<br />';
      //         //                 str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
      //         //                     + params[0].color + '"></span>流量:'+
      //         //                     params[0].value+'<br />';
      //         //             }
      //         //             return str;
      //         //         }
      //         //     }
      //         // },
      //         colors:["#2098f2","#9b7ae0","#92c72e"]
      //     })

      //     $(".hisflow-analysis").mCustomScrollbar();

      // });
    },
    simulate (form) {
      this.$refs[form].validate((isValid) => {
        if (isValid) {
          alert('message')
        }
      })
    },
    stsFormat (val) {
      if (parseFloat(val) > 0.7) {
        return {
          'sts': 'high',
          'txt': '高'
        }
      } else if (parseFloat(val) < 0.4) {
        return {
          'sts': 'warn',
          'txt': '低'
        }
      } else {
        return {
          'sts': 'success',
          'txt': '正常'
        }
      }
    }
  },
  mounted: function () {
    // let i = WLoading()
    // setTimeout(()=>{
    //   i.close()
    // },3000)
  },
  computed: {
    cpuStatus () {
      return this.stsFormat(this.vmInfo.cpuLoad)
    },
    memoryStatus () {
      return this.stsFormat(this.vmInfo.memoryLoad)
    },
    storageStatus () {
      return this.stsFormat(this.vmInfo.storageLoad)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/component/_layout.scss';
@import '@/assets/scss/component/_var.scss';
.resource:hover{
  cursor:pointer;
}
.form-row-label{
  font-weight:bold;
}
.whiteBg {
    background:#fff;
  }
.content-title > span:before{
    display:none;
}
.list-module li .list-item-text{
    width: 65%;
}

.content-title > span:before{
    display:none;
}

.show-panel {
    display: block!important;
    box-shadow: 0px 0px 10px #ccc;
}

.select-panel {
    position: absolute;
    left:15%;
    display: none;
    width: 70%;
    margin: 0 auto;
    margin-top: 1em;
    padding: 1em;
    z-index:10;
}

.select-search {
    position: relative;
}

.search-content {
    width: 100%;
    height: 30px;
    padding-right: 2em;
    padding-left:0.5em;
    border-radius: 0.5em;
    box-shadow: none;
    border: 1px solid #ccc;

    &:focus {
        border-color: #2198f2;
    }
}

.search-icon {
    position: absolute;
    top: 24%;
    right: 0.5em;
    color: #aaa;
}

.select-item {
    max-height: 200px;
    overflow-y: auto;
    li {
        margin-top: 0.5em;
        padding: 0.5em;
        &:hover {
            cursor:pointer;
            color: #fff;
            background: #00a0e9;

        }
    }
}

.hide-select-item {
    display: none;
}

.content-header {
    label {
        height: 30px;
        display:inline-block;
        line-height: 30px;
        margin-left: -8px;
        margin-top: 0.5em;
        padding: 0 0.5em;
        color: #fff;
        font-weight: normal;
        background: #00a0e9;
    }

    span {
        margin-left: 2em;
        color:$color-danger;
        height: 26px;
        line-height: 26px;
        display:inline-block;
        background-color:rgba($color-danger, 0.1);
        padding:0 4px;
    }
    img{
        margin-right:8px;
    }
}

.content-statistic-module {
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
    .flex-space-1{
        text-align:center;
    }
    .flow-num {
        font-size: 24px;
        color: #2296f4;
        &.warm{
            color:$color-warning;
        }
        &.critical{
            color:$color-critical;
        }
    }

    .flow-text {
        font-size: 12px;
        color:#b8b8b8;
        .label-btn{
            margin-left:4px;
        }
    }
}
.Row-content table{
  width:100%;
  tr{
    height:30px;
  }
  td{
    padding: 10px 20px;
  }
  tbody{
    background:#e5e5e5;
    padding:10px;
  }
  .tip-info.warn{
    color:$color-warning;
  }
  .tip-info.danger{
    color:$color-danger;
  }
  .tip-info.success{
    color:$color-success;
  }
}
</style>
