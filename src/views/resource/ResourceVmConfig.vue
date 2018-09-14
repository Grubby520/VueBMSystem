<template>
  <div>
    <el-row :gutter="15" style="overflow:hidden;">
      <el-col :span="6">
        <app-list :name='curBusinessName'>
          <w-dropdown
            slot="list1"
            @item-click="itemClickHandle"
            :itemlist="businessList"
            placeholder="请输入"
            nodatatext="暂无数据"
            :show="showDropDown"></w-dropdown>
          <w-dropdown-ext style="margin-top:1em;"
            slot="list2"
            @item-click="appClickHandle"
            :show="true"
            :itemlist="vmList"
            placeholder="请输入"
            nodatatext="没找到虚拟机"
            :add-icon="true"
            :has-status="true"
            icon-class="pageIconFont icon-webpage"
            status-icon-type="text"
            :item-text-style="{width:'75%'}"></w-dropdown-ext>
        </app-list>
      </el-col>
      <el-col :span="18">
        <div class="whiteBg" style="padding-bottom:20000px;margin-bottom:-20000px">
          <div class="content-header">
            <label>{{curVmName}}</label>
            <span v-if="runStatusTxt != ''" class="app-status"><img height="18px" width="18px" src="#springUrl('/images/images/prompt_box_warining.png')" alt="">负载{{runStatusTxt}}，需要优化！</span>
          </div>
          <div class="flex-layout" style="margin: 0 20px;">
             <div style="margin-right: 15px;" class="flex-layout flex-item-row flex-space-1 content-statistic-module">
               <h1>当前配置</h1>
               <div class="flex-layout flow-content">
                 <div class="flex-space-1">
                   <div class="flow-num" id="res-cpu">{{curConfig.cpuCoreCount}}</div>
                   <span class="flow-text">CPU(个)</span>
                 </div>
                 <div class="flex-space-1">
                   <div class="flow-num" id="res-rvm">{{curConfig.memoryCount}}</div>
                   <span class="flow-text">内存(MB)</span>
                 </div>
                 <div class="flex-space-1">
                   <div class="flow-num" id="res-storage">{{curConfig.storageCount}}</div>
                   <span class="flow-text">储存(GB)</span>
                 </div>
               </div>
             </div>
             <div class="flex-layout flex-item-row flex-space-1 content-statistic-module">
               <h1>平均负载</h1>
               <div class="flex-layout flow-content">
                 <div class="flex-space-1">
                   <div class="flow-num normal" id="load-cpu">{{resourceAVGLoad.cpuLoadRate*100}}<span class="pct">%</span></div>
                   <span class="flow-text">CPU<base-label :type="resourceAVGLoad.cpuLoadEvaluationsts" v-text="resourceAVGLoad.cpuLoadEvaluation"></base-label></span>
                 </div>
                 <div class="flex-space-1">
                   <div class="flow-num danger" id="load-rvm">{{resourceAVGLoad.memLoadRate*100}}<span class="pct">%</span></div>
                   <span class="flow-text">内存<base-label :type="resourceAVGLoad.memLoadEvaluationsts" v-text="resourceAVGLoad.memLoadEvaluation"></base-label></span>
                 </div>
                 <div class="flex-space-1 warm">
                   <div class="flow-num" id="load-storage">{{resourceAVGLoad.storageLoadRate*100}}<span class="pct">%</span></div>
                   <span class="flow-text">储存<base-label :type="resourceAVGLoad.storageLoadEvaluationsts" v-text="resourceAVGLoad.storageLoadEvaluation"></base-label></span>
                 </div>
               </div>
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
              <div id="loadTrend"></div>
            </div>
          </w-row>
          <w-row>
            <template slot="title" class="label">资源优化配置分析</template>
            <div slot="content">
              <table >
                <thead>
                  <tr>
                    <td>现有配置</td>
                    <td>优化建议</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CPU负载<span class="tip-info" :class="resourceAVGLoad.cpuLoadEvaluationsts" v-text="resourceAVGLoad.cpuLoadEvaluation">高</span>，平均负载<span  class="tip-info" :class="resourceAVGLoad.cpuLoadEvaluationsts" v-text="resourceAVGLoad.cpuLoadRate*100?resourceAVGLoad.cpuLoadRate*100+'%':'?%'">33</span></td>
                    <td><base-label :type="suggestConfig.suggestCpu != suggestConfig.cpu? 'warn' : 'success'" >{{suggestConfig.suggestCpu != suggestConfig.cpu? '建议优化' : '保持现有配置'}}</base-label>
                      <template v-if="suggestConfig.suggestCpu != suggestConfig.cpu">
                        推荐CPU配置（个）：<span v-text="suggestConfig.suggestCpu?suggestConfig.suggestCpu:'?'"></span>
                      </template>
                    </td>
                  </tr>
                  <tr>
                    <td>内存负载<span class="tip-info" :class="resourceAVGLoad.memLoadEvaluationsts" v-text="resourceAVGLoad.memLoadEvaluation">高</span>，平均负载<span class="tip-info" :class="resourceAVGLoad.memLoadEvaluationsts" v-text="resourceAVGLoad.memLoadRate*100?resourceAVGLoad.memLoadRate*100+'%':'?%'">33</span></td>
                    <td><base-label :type="suggestConfig.suggestMemory != suggestConfig.memory? 'warn' : 'success'">{{suggestConfig.suggestMemory != suggestConfig.memory? '建议优化' : '保持现有配置'}}</base-label>
                      <template v-if="suggestConfig.suggestMemory != suggestConfig.memory">
                        推荐内存配置（GB）：<span v-text="suggestConfig.suggestMemory?suggestConfig.suggestMemory:'?'"></span>
                      </template>
                    </td>
                  </tr>
                  <tr>
                    <td>存储负载<span class="tip-info" :class="resourceAVGLoad.storageLoadEvaluationsts" v-text="resourceAVGLoad.storageLoadEvaluation">高</span>，平均负载<span class="tip-info" :class="resourceAVGLoad.storageLoadEvaluationsts" v-text="resourceAVGLoad.storageLoadRate*100?resourceAVGLoad.storageLoadRate*100+'%':'?%'">33</span></td>
                    <td><base-label :type="suggestConfig.suggestStorage != suggestConfig.storage? 'warn' : 'success'">{{suggestConfig.suggestStorage != suggestConfig.storage? '建议优化' : '保持现有配置'}}</base-label>
                      <template v-if="suggestConfig.suggestStorage != suggestConfig.storage">
                        推荐存储配置（GB）：<span v-text="suggestConfig.suggestStorage?suggestConfig.suggestStorage:'?'"></span>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
              <base-button style="margin-top: 10px;"  @click="dialogVisible = true">仿真</base-button>
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
            <base-label
            class="large"
            v-for="(item, index) in specification"
            :value="item.value"
            style="margin-right:4px;margin-bottom:4px"
            :active = 'index == 0'
            :isRadius="false"
            :isPointer="true"
            @click="handleChoseClick" >{{item.name}}</base-label>
          </w-form-item>
          <!-- <div  slot="content">
                    <base-input v-model="form.username" :is-radius="true" iconPreFix="icon-home_page-management iconfont" placeholder="请输入用户名" />
              <base-label class="large" value="231" style="margin-right:4px" :active = "true" :isRadius="false" :isPointer="true" @click="handleChoseClick" >fdas</base-label>
              <base-label class="large" value="231"  :isRadius="false" :isPointer="true" @click="handleChoseClick" >fdas</base-label>

          </div> -->
        </w-row>
        <w-row>
          <w-form-item :isRequired="true" name="diskValue" label="请输入磁盘大小">
            <base-input  v-model="form.diskValue"  placeholder="请输入磁盘大小" style="margin-right:4px" />
            <w-select v-model="form.diskUnit" :list="diskUnitList" :clearable="false" size="small">

            </w-select>
          </w-form-item>
        </w-row>

        <w-row title="仿真结果">
          <div slot="content">
            <div id="simulate"></div>
          </div>
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
import WDropdown from '@/components/common/WDropdown.vue'
import WDropdownExt from '@/components/common/WDropdownExt.vue'
import WForm from '@/components/common/form/WForm.vue'
import WSelect from '@/components/common/select/WSelect.vue'
import WFormItem from '@/components/common/form/WFormItem.vue'
import WRow from '@/components/common/WRow.vue'
import BaseLabel from '@/components/common/base/BaseLabel.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseInput from '@/components/common/base/BaseInput.vue'
import WDialog from '@/components/common/WDialog.vue'
import { mapMutations, mapState } from 'vuex'
import WLoading from '@/components/common/loading/index.js'
import AppList from './_AppList.vue'
import config_mixins from './config_mixins.js'
import emitter from '@/components/mixins/emitter.js'
import API from '@/assets/js/api/api.js'
import Charts from '@/assets/js/components/chartsFun.js'

export default {
  mixins: [config_mixins, emitter],
  data () {
    var _this = this
    return {
      showDropDown:false,
      form: {
        vmType: '',
        diskValue: '',
        diskUnit:'GB'
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
      specification:[],
      diskList: [],
      diskUnitList:[{
        name:'GB',
        value:'GB'
      },{
        name:'TB',
        value:'TB'
      }],
      vmList: [{
        existExceptionFlow: null,
        id: '4fba5622-a306-4cd1-aa76-3d423d0674e4',
        name: 'net-test-business1测试',
        statusClass: '',
        statusText: ''
      }],
      curBusinessId:'',
      curBusinessName: '?',
      curVmName:'?',
      curVmId:'',
      resourceAVGLoad:{
          "loadRate": '?',
          "cpuLoadEvaluation":'?',
          "storageLoadEvaluation":'?',
          "memLoadEvaluation":'?',
          "cpuLoadRate": '?',
          "memLoadRate": '?',
          "storageLoadRate": '?'
      },
      loadTrend:[
        {
          "id": null,
          "name": null,
          "type": null,
          "loadRate": 0,
          "loadEvaluation": null,
          "loadCompare": 0,
          "date": "2018-09-09",
          "week": "Sunday",
          "cpuLoadRate": 0.2,
          "memLoadRate": 0.1,
          "storageLoadRate": 0.15,
          "diskReadThrough": 0,
          "diskWriteThrough": 0,
          "diskReadIo": 0,
          "diskWriteIo": 0,
          "netLoad": 0
        },
        {
          "id": null,
          "name": null,
          "type": null,
          "loadRate": 0,
          "loadEvaluation": null,
          "loadCompare": 0,
          "date": "2018-09-10",
          "week": "Monday",
          "cpuLoadRate": 0.51,
          "memLoadRate": 0.5,
          "storageLoadRate": 0.5,
          "diskReadThrough": 0,
          "diskWriteThrough": 0,
          "diskReadIo": 0,
          "diskWriteIo": 0,
          "netLoad": 0
        },
        {
          "id": null,
          "name": null,
          "type": null,
          "loadRate": 0,
          "loadEvaluation": null,
          "loadCompare": 0,
          "date": "2018-09-11",
          "week": "Tuesday",
          "cpuLoadRate": 0.51,
          "memLoadRate": 0.5,
          "storageLoadRate": 0.5,
          "diskReadThrough": 0,
          "diskWriteThrough": 0,
          "diskReadIo": 0,
          "diskWriteIo": 0,
          "netLoad": 0
        }
      ],
      curConfig:{
        "cpuCoreCount": '?',
        "instanceCount": '?',
        "memoryCount": '?',
        "storageCount": '?'
      },
      suggestConfig:{
        "cpu": 0,
        "cpuRate": 0,
        "instanceName": "vm-001",
        "instanceUuid": "58849cfa-61aa-4806-8652-e8f4b4e707f8",
        "memory": 0,
        "memoryRate": 0,
        "status": 1,
        "storage": 0,
        "storageRate": 0,
        "suggestCpu": 0,
        "suggestMemory": 0,
        "suggestStorage": 0
      },
      businessList: [],
      dialogVisible: false,
      runStatusTxt: '', // 运行状态
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
    WSelect,
    WDropdown,
    WDropdownExt
  },
  methods: {
    bindClick(){
      let vm = this
      $('body').off('click').on('click', ':not(.list-module li)', function (e) {
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
    },
    itemClickHandle: function (data) { // 切换business
      let vm = this
      vm.showDropDown = false
      vm.curBusinessName = data.name
      vm.curBusinessId = data.businessId
      this.getResourceLoadVmList()
    },
    appClickHandle(data, event) { // 点击虚拟机
      if (event.target.localName == 'li') {
        $(event.target).siblings().removeClass('active')
          .end().addClass('active')
      } else if (event.target.localName == 'span') {
        $(event.target).parent().siblings().removeClass('active')
          .end().addClass('active')
      }
      this.clearTimerIdS()
      this.curVmName = data.name
      this.curVmId = data.id
      this.getLoadTrend()
      this.getResourceAVGLoad()
      this.getResInstanceConfigStatisticst()
      this.getResInstanceConfigDetail()
    },
    getLoadTrend() {// 本月负载趋势
      API.getLoadTrendVmList.call(this).then((res) => {
        let data = [
            {
              "id": null,
              "name": null,
              "type": null,
              "loadRate": 0,
              "loadEvaluation": null,
              "loadCompare": 0,
              "date": "2018-09-09",
              "week": "Sunday",
              "cpuLoadRate": 0.2,
              "cpuLoadEvaluation": null,
              "memLoadRate": 0.1,
              "memLoadEvaluation": null,
              "storageLoadRate": 0.15,
              "storageLoadEvaluation": null,
              "diskReadThrough": 0,
              "diskWriteThrough": 0,
              "diskReadIo": 0,
              "diskWriteIo": 0,
              "netLoad": 0
            },
            {
              "id": null,
              "name": null,
              "type": null,
              "loadRate": 0,
              "loadEvaluation": null,
              "loadCompare": 0,
              "date": "2018-09-10",
              "week": "Monday",
              "cpuLoadRate": 0.51,
              "cpuLoadEvaluation": null,
              "memLoadRate": 0.5,
              "memLoadEvaluation": null,
              "storageLoadRate": 0.5,
              "storageLoadEvaluation": null,
              "diskReadThrough": 0,
              "diskWriteThrough": 0,
              "diskReadIo": 0,
              "diskWriteIo": 0,
              "netLoad": 0
            },
            {
              "id": null,
              "name": null,
              "type": null,
              "loadRate": 0,
              "loadEvaluation": null,
              "loadCompare": 0,
              "date": "2018-09-11",
              "week": "Tuesday",
              "cpuLoadRate": 0.51,
              "cpuLoadEvaluation": null,
              "memLoadRate": 0.5,
              "memLoadEvaluation": null,
              "storageLoadRate": 0.5,
              "storageLoadEvaluation": null,
              "diskReadThrough": 0,
              "diskWriteThrough": 0,
              "diskReadIo": 0,
              "diskWriteIo": 0,
              "netLoad": 0
            }
          ]
        let formatData = {
            xValue: [],
            value:[
              {
                  name:'CPU',
                  data:[]
              },
              {
                  name:'内存',
                  data:[]
              },
              {
                  name:'存储',
                  data:[]
              }
            ]
          }
        data.forEach((item) => {
          formatData.xValue.push(item.date)
          formatData.value[0].data.push(item.cpuLoadRate*100)
          formatData.value[1].data.push(item.memLoadRate*100)
          formatData.value[2].data.push(item.storageLoadRate*100)
        })
        Charts.initLine({
           id: 'loadTrend',
           unit:'%',
           data:formatData,
           symbol: 'circle',
           legendIcon: 'circle',
           opacity: 0,
           options:{
              grid: {
                top: '5%',
                bottom: '15%'
              },
              legend: {
                bottom: '5%'
              }
            },
           smooth:false,
           // options:{
           //     tooltip:{
           //         formatter:function(params){
           //             var str = '';
           //             if(params instanceof Array){
           //                 str = params[0].name+'<br />';
           //                 str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
           //                     + params[0].color + '"></span>流量:'+
           //                     params[0].value+'<br />';
           //             }
           //             return str;
           //         }
           //     }
           // },
           colors:["#2098f2","#9b7ae0","#92c72e"]
        })

      })
    },
    getResInstanceConfigStatisticst() { // 当前配置
      API.getResInstanceConfigStatisticst(this,{id:this.curVmId, statisticsBy:'instance'}).then((res) => {
        let data = {
            "cpuCoreCount": 400,
            "instanceCount": 50,
            "memoryCount": 2048,
            "storageCount": 20480
          }
        data = res.data.body
        this.curConfig = data

      })
    },
    getResourceAVGLoad() {// 平均负载
      API.getResourceLoadVmList.call(this, {filterType:'business',filterId:this.curBusinessId, summaryDimension:'vm'}).then((res) => {
        let data =  {
            "id": "240f353a-7c4f-4c6b-a66a-b8b232ff0429",
            "name": "zc_cirros_006-4",
            "type": null,
            "loadRate": 0.79,
            "loadEvaluation": "高",
            "loadCompare": 0,
            "date": null,
            "week": null,
            "cpuLoadRate": 0.92,
            "cpuLoadEvaluation": "高",
            "memLoadRate": 0,
            "memLoadEvaluation": "低",
            "storageLoadRate": 0.7,
            "storageLoadEvaluation": "中",
            "diskReadThrough": 0,
            "diskWriteThrough": 0,
            "diskReadIo": 0,
            "diskWriteIo": 0,
            "netLoad": 0
          }
        // data = res.data.body
        for(let i in data){
          if(data[i] === '高'){
            data[i+'sts'] = 'high'
          }
          if(data[i] === '中'){
            data[i+'sts'] = 'success'
          }
          if(data[i] === '低'){
            data[i+'sts'] = 'warn'
          }
        }
        this.resourceAVGLoad = data
      })
    },
    getResInstanceConfigDetail() {
      API.getResInstanceConfigDetail.call(this, {id: this.curVmId, statisticsBy:'instance'}).then((res) => {
        this.suggestConfig = res.data.body[0]
      })
    },
    getResourceLoadVmList() {
      API.getResourceLoadVmList.call(this, {filterType:'business',filterId:this.curBusinessId, summaryDimension:'vm'}).then((res) => {
        let data =  [
              {
                "id": "240f353a-7c4f-4c6b-a66a-b8b232ff0429",
                "name": "zc_cirros_006-4",
                "type": null,
                "loadRate": 0.79,
                "loadEvaluation": "高",
                "loadCompare": 0,
                "date": null,
                "week": null,
                "cpuLoadRate": 0.92,
                "memLoadRate": 0,
                "storageLoadRate": 0.7,
                "diskReadThrough": 0,
                "diskWriteThrough": 0,
                "diskReadIo": 0,
                "diskWriteIo": 0,
                "netLoad": 0
              },
              {
                "id": "dce076bf-5cca-4a4b-aca3-942f3757a0dd",
                "name": "zabbix_bk",
                "type": null,
                "loadRate": 0.9,
                "loadEvaluation": "高",
                "loadCompare": 0,
                "date": null,
                "week": null,
                "cpuLoadRate": 0.1,
                "memLoadRate": 0,
                "storageLoadRate": 0.3,
                "diskReadThrough": 0,
                "diskWriteThrough": 0,
                "diskReadIo": 0,
                "diskWriteIo": 0,
                "netLoad": 0
              }
            ]
        // data = res.data.body.data
        if(data.length == 0) return
        this.vmList = data.map((item) => {
          return {
            existExceptionFlow: null,
            id: item.id,
            name: item.name,
            statusClass:item.loadEvaluation == '高'? 'label-btn abnormal':'',
            statusText: item.loadEvaluation == '高'? item.loadEvaluation:''
          }
        })
        this.curVmName = data[0].name
        this.curVmId = data[0].id
        this.getLoadTrend()
        this.getResourceAVGLoad()
        this.getResInstanceConfigStatisticst()
        this.getResInstanceConfigDetail()
      })
    },
    getResInstanceConfigMock () {
      API.getResInstanceConfigMock.call(this, {
        cpu:this.form.vmType.cpu,
        instanceUuid: this.curVmId,
        memory:this.form.vmType.memory,
        storage:this.form.diskUnit ==='GB'? this.form.diskValue:this.form.diskValue*1024
      }).then((res) => {

      })
      let datatem =  {
          "cpuRate": [
            {
              "createTime": "2018-07-19 0:0:0",
              "loadValue": "2"
            }
          ],
          "memoryRate": [
            {
              "createTime": "2018-07-19 0:0:0",
              "loadValue": "4"
            }
          ],
          "storageRate": [
            {
              "createTime": "2018-07-19 0:0:0",
              "loadValue": "8"
            }
          ]
        }

      let formatData = {
          xValue: [],
          value:[
            {
                name:'CPU',
                data:[]
            },
            {
                name:'内存',
                data:[]
            },
            {
                name:'存储',
                data:[]
            }
          ]
        }
      let i = 0
      for(let k in datatem){
        datatem[k].forEach((item, index) => {
          if(k === 'cpuRate') formatData.xValue.push(item.createTime)
          formatData.value[i].data.push(item.loadValue)
        })
        i ++
      }

      Charts.initLine({
         id: 'simulate',
         unit:'%',
         data:formatData,
         symbol: 'circle',
         legendIcon: 'circle',
         opacity: 0,
         options:{
            grid: {
              top: '5%',
              bottom: '15%'
            },
            legend: {
              bottom: '5%'
            }
          },
         smooth:false,
         // options:{
         //     tooltip:{
         //         formatter:function(params){
         //             var str = '';
         //             if(params instanceof Array){
         //                 str = params[0].name+'<br />';
         //                 str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
         //                     + params[0].color + '"></span>流量:'+
         //                     params[0].value+'<br />';
         //             }
         //             return str;
         //         }
         //     }
         // },
         colors:["#2098f2","#9b7ae0","#92c72e"]
      })
    },
    getSpecification(){ // 虚拟机规格
      let _this = this
      API.getSpecification.call(this).then((res) => {
        res.data.body.forEach((item) => {
          _this.specification.push({
            name:item.cores+'核'+item.memoryCapacity+'GB',
            value:{
              cpu:item.cores,
              memory:item.memoryCapacity,
              storage:item.storageCapacity
            }
          })
        })
        _this.form.vmType = {..._this.specification[0].value, instanceUuid:_this.curVmId}
      })
    },
    getUserInfoByToken(){
      return API.getUserInfoByToken.call(this).then((res) => {
        return res.data.body.tenantId
      })
    },
    getBusinessList(tenantId){
      API.getBusinessList.call(this, {tenantId: tenantId}).then((res) => {
        let data = [
          {
            'abnormalStatus': false,
            'businessId': '07c562d2-b8b5-4e25-8444-12c7022d5857',
            'businessName': '四川省地质资料信息集群化共享服务平台',
            'orgId': 26,
            'businessName': '国土资源厅',
            'providerId': 1,
            'providerName': '移动-华三',
            'regionChName': '政务外网资源池',
            'regionEgName': 'inner',
            'regionId': 1,
            'regionProviderIds': '1d00a0ba-3ee6-11e8-9e3f-00e0ed433b66,1d00a2c3-3ee6-11e8-9e3f-00e0ed433b66',
            'tenantId': 158,
            'tenantName': 'gtzyt',
            'vmList': [
              {
                'businessId': '04334157-c460-4373-a5c0-eae79e72f43f',
                'businessName': '四川省电子政务外网管理系统',
                'businesseList': [
                  null
                ],
                'cores': 8,
                'innerIp': '172.31.0.121',
                'ip': '225.64.4.226',
                'memoryCapacity': 16,
                'orgId': 1,
                'businessName': '办公厅',
                'providerTenantId': 123,
                'storageCapacity': 2,
                'tenantId': 1,
                'tenantName': 'bgt',
                'vmName': 'vm-01',
                'vmUuid': '04334157-c460-4373-a5c0-eae79e72f43f'
              }
            ]
          }
        ]
        // data = res.data.body.data
        if(data.length === 0) return
        this.businessList = data.map((item) => {
          item.name = item.businessName
          return item
        })
        this.curBusinessName = this.businessList[0].name
        this.curBusinessId = this.businessList[0].businessId
        this.getResourceLoadVmList()
      })
    },
    handleChoseClick (instance) { // 弹框
      this.form.vmType = instance.isActive ? instance.$attrs.value : ''
      this.broadcast('WFormItem', 'formItem.blur')
      instance.$parent.$children.forEach((item) => {
        if (item._uid != instance._uid) {
          item.isActive = false
        }
      })
    },
    // itemClickHandle: function (data, event) {
    //   this.clearTimerIdS('res-cpu', 'res-rvm', 'res-storage', 'load-cpu', 'load-rvm', 'load-storage')
    //   this.curBusinessName = data.name
    //   this.curBusinessId = data.businessId

    //   // 虚拟机详情
    //   // api.ajaxPost({
    //   //     url:'/resource/vm-config/businessInfo',
    //   //     data:{
    //   //         vmId:itemId
    //   //     }
    //   // }).then(function(data){
    //   //     data = JSON.parse(data.result);

    //   //     if(data.businessRunStatus == 'busy'){
    //   //         this.runStatusTxt = '高'
    //   //     }
    //   //     if(data.businessRunStatus == 'idle'){
    //   //         this.runStatusTxt = '低'
    //   //     }

    //   //     if(data.vmInfo){
    //   //         _this.businessName = data.vmInfo.name;
    //   //         _this.vmInfo  = data.vmInfo
    //   //         if(data.vmInfo.cpuNum >= 0){
    //   //             addNumAnim(new CountUp("res-cpu", 0,data.vmInfo.cpuNum, 0, 2.5));
    //   //         }else{
    //   //             $("#res-cpu").text('?');
    //   //         }
    //   //         if(data.vmInfo.memory >= 0){
    //   //             addNumAnim(new CountUp("res-rvm", 0,data.vmInfo.memory, 2, 2.5));
    //   //         }else{
    //   //             $("#res-rvm").text('?');
    //   //         }
    //   //         if(data.vmInfo.storage >= 0){
    //   //             addNumAnim(new CountUp("res-storage", 0,data.vmInfo.storage, 2, 2.5));
    //   //         }else{
    //   //             $("#res-storage").text('?');
    //   //         }
    //   //         if(data.vmInfo.cpuLoad >= 0){
    //   //             addNumAnim(new CountUp("load-cpu", 0,data.vmInfo.cpuLoad, 2, 2.5));
    //   //         }else{
    //   //             $("#load-cpu").text('?');
    //   //         }
    //   //         if(data.vmInfo.memoryLoad >= 0){
    //   //             addNumAnim(new CountUp("load-rvm", 0,data.vmInfo.memoryLoad, 2, 2.5));
    //   //         }else{
    //   //             $("#load-rvm").text('?');
    //   //         }
    //   //         if(data.vmInfo.storageLoad >= 0){
    //   //             addNumAnim(new CountUp("load-storage", 0,data.vmInfo.storageLoad, 2, 2.5));
    //   //         }else{
    //   //             $("#load-storage").text('?');
    //   //         }
    //   //     }

    //   //     //流量趋势(一个月)
    //   //     for(var i in data.LastMonthLoad){
    //   //         if(i == 'xabscissa') continue
    //   //         data.LastMonthLoad[i].forEach((item, index)=>{
    //   //             if(parseFloat(_this.LastMonthLoad.max) < parseFloat(item)*100){
    //   //                 _this.LastMonthLoad.max = parseFloat(item)*100
    //   //                 _this.LastMonthLoad.maxTime = data.LastMonthLoad.xabscissa[index]
    //   //             }
    //   //             if(parseFloat(_this.LastMonthLoad.min) > parseFloat(item)*100){
    //   //                 _this.LastMonthLoad.min = parseFloat(item)*100
    //   //                 _this.LastMonthLoad.minTime = data.LastMonthLoad.xabscissa[index]
    //   //             }
    //   //        })
    //   //     }

    //   //     Charts.initLine({
    //   //         id: 'loadTrend',
    //   //         unit:'%',
    //   //         data:{
    //   //             xValue:data.LastMonthLoad.xabscissa,
    //   //             value:[
    //   //                 {
    //   //                     name:'CPU',
    //   //                     data:data.LastMonthLoad.cpu
    //   //                 },
    //   //                 {
    //   //                     name:'内存',
    //   //                     data:data.LastMonthLoad.memory
    //   //                 },
    //   //                 {
    //   //                     name:'存储',
    //   //                     data:data.LastMonthLoad.storage
    //   //                 }
    //   //             ]
    //   //         },
    //   //         smooth:false,
    //   //         // options:{
    //   //         //     tooltip:{
    //   //         //         formatter:function(params){
    //   //         //             var str = '';
    //   //         //             if(params instanceof Array){
    //   //         //                 str = params[0].name+'<br />';
    //   //         //                 str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'
    //   //         //                     + params[0].color + '"></span>流量:'+
    //   //         //                     params[0].value+'<br />';
    //   //         //             }
    //   //         //             return str;
    //   //         //         }
    //   //         //     }
    //   //         // },
    //   //         colors:["#2098f2","#9b7ae0","#92c72e"]
    //   //     })

    //   //     $(".hisflow-analysis").mCustomScrollbar();

    //   // });
    // },
    simulate (form) { // 模拟仿真
      this.$refs[form].validate((isValid) => {
        if (isValid) {
          this.getResInstanceConfigMock()

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
    this.$nextTick(() => {
      this.bindClick()
    })
  },
  created() {
    this.getSpecification()
    this.getUserInfoByToken().then((tenantId) => {
      this.getBusinessList(tenantId)
    })
  },
  computed: {
    ...mapState(['userInfo']),
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
#simulate{
  height:200px;
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

#loadTrend{
  height:200px;
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
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin-left: 8px;
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

.pct{
  font-size:12px;
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
* /deep/ .label-btn.abnormal {
  background: $color-danger;
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
  .tip-info.danger, .tip-info.high{
    color:$color-danger;
  }
  .tip-info.success{
    color:$color-success;
  }
}
</style>
