<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="24">
        <w-table :isLoading = "isLoading">
          <template slot="title">单位流量列表</template>
          <template slot="opt">
            <div style="display: inline-block;margin-right: 6px;">
              <w-select filterable v-model="value" ref="select" :list="businessList"></w-select>
            </div>
            <base-button-group>
              <base-button  @click="getTableList(1)">查询</base-button>
              <base-button  @click="mark">标记为正常</base-button>
            </base-button-group>
          </template>
          <template slot="table-list">
            <div id="flow_event_table">
              <el-table
                  :data="tableData"
                  @selection-change="handleSelectionChange"
                  stripe
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    type="expand"
                    width="55">
                    <template slot-scope="scope">
                      获取中...
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="time"
                    label="访问时间"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="ip"
                    label="访问IP"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="port"
                    label="端口">
                  </el-table-column>
                  <el-table-column
                    prop="city"
                    label="地区">
                  </el-table-column>
                  <el-table-column
                    prop="businessName"
                    label="业务系统">
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="访问行为">
                  </el-table-column>
                  <el-table-column
                    prop="type"
                    label="异常类型">
                  </el-table-column>
              </el-table>
              <el-pagination
                  v-show="pageTotal > 20"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next, jumper"
                  :total="pageTotal">
              </el-pagination>
            </div>
          </template>
        </w-table>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="mt15">
      <el-col :span="12">
        <w-row :isLoading = "isLoading2">
          <template slot="title">异常流量top5的业务系统</template>
          <div slot="content">
            <w-top5 :toplist="toplist1"></w-top5>
          </div>
        </w-row>
      </el-col>
      <el-col :span="12">
        <w-row :isLoading = "isLoading3">
          <template slot="title">异常流量top5的地区</template>
          <div slot="content">
            <w-top5 :toplist="toplist2"></w-top5>
          </div>
        </w-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/* global $ */
import WTable from '@/components/common/WTable.vue'
import WGraph from '@/components/common/WGraph.vue'
import WSelect from '@/components/common/select/WSelect.vue'
import WMessage from '@/components/common/message/index.js'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
import WTop5 from '@/components/common/WTop5.vue'
import WRow from '@/components/common/WRow.vue'
import { mapMutations, mapState } from 'vuex'
import { urls } from '@/assets/js/api/api.js'
import menuMixin from '@/components/mixins/menu_mixin.js'
import xhr from '@/assets/js/components/utility.js'
let time = new Date()

export default{
  mixins: [menuMixin],
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-flow',
        name: '互联网流量监管'
      }, {
        iconClass: 'iconfont icon-flow_overview-management',
        name: '异常流量事件'
      }],
      isLoading: true,
      isLoading2: true,
      isLoading3: true,
      businessList: [],
      value: null,
      currentPage: 1, // 当前的页码
      pageTotal: 0,
      tableData: [],
      multipleSelection: [],
      toplist1: [],
      toplist2: []
    }
  },
  created () {

  },
  mounted () {
    this.getTableList()
    this.getApps()
    this.getTop5()
    this.setCrumbs(this.crumbs)
    // this.$nextTick(()=>{
    //   this.getDetail()
    // })
  },
  computed: {
    ...mapState['userInfo']
  },
  methods: {
    getDetail () {
      // this.$http.get
      // const h = this.$createElement
      let _this = this
      // var htmlStr = (
      //     <tr class="tr-more"><td colspan="9">444</td></tr>
      //   )
      // $(e.target).parent().parent().after(htmlStr)
      $('.el-table__expand-icon').click(function (e) {
        if ($(this).hasClass('el-table__expand-icon--expanded')) { return }
        let index = $(this).index()
        _this.tableData[index]
        _this.$http.post(urls.flowAlarmRawData, {
          'srcIp': _this.tableData[index].ip,
          'srcPort': _this.tableData[index].port,
          'timestamp': _this.tableData[index].timestamp,
          'type': _this.tableData[index].type
        })
          .then((res) => {
            if (res.data.body.length > 0) {
              $('.el-table__expanded-cell').text(JSON.tringify(res.data.body.data))
            } else {
              $('.el-table__expanded-cell').text('暂无')
            }
          })
      })
    },
    getTableList (page = 1) { // 访问时间 访问IP 端口 地区 业务系统 访问行为 异常类型
      this.$http.get(urls.flowAlarmList, {
        params: {
          pageSize: 20,
          page: page,
          businessId: this.value
        }
      })
        .then((res) => {
          this.tableData = res.data.body.data
          this.pageTotal = res.data.body.total
          this.$nextTick(() => {
            this.getDetail()
          })
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getApps () { // 获取应用、单位
      let _this = this
      this.$http.get(urls.businessList, {
        params: {
          pageSize: 9999999,
          page: 1
        }
      })
        .then((res) => {
          if (res.data.body.data.length > 0) {
            _this.businessList = res.data.body.data.map((item) => {
              return {name: item.businessName, id: item.businessId}
            })
          }
        })
    },
    mark () {
      if (this.multipleSelection.length === 0) return
      let params = this.multipleSelection.map((item) => {
        return {
          srcIp: item.ip,
          srcPort: item.port,
          type: item.type
        }
      })
      this.$http.post(urls.flowAlarmMarkNormal, params)
        .then((res) => {
          WMessage({
            message: '成功',
            type: 'success'
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getTop5 () {
      this.$http.post(urls.topList, {
        dimension: 'business', // 业务系统
        size: 5,
        flowType: 'flowAbnormal' // 异常
      })
        .then((res) => {
          if (res.data.body.length > 0) {
            let max = 0
            res.data.body.forEach((item) => {
              if (item.flow > max) {
                max = item.flow
              }
            })
            this.toplist1 = res.data.body.map((item) => {
              return {
                label: item.name,
                text: item.flow + 'GB',
                percentage: max == 0 ? 0 : (item.flow / max) * 100
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.isLoading2 = false
        })
      this.$http.post(urls.topList, {
        dimension: 'area', // 地区
        size: 5,
        flowType: 'flowAbnormal' // 异常
      })
        .then((res) => {
          if (res.data.body.length > 0) {
            let max = 0
            res.data.body.forEach((item) => {
              if (item.flow > max) {
                max = item.flow
              }
            })
            this.toplist2 = res.data.body.map((item) => {
              return {
                label: item.name,
                text: item.flow + 'GB',
                percentage: max == 0 ? 0 : (item.flow / max) * 100
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          this.isLoading3 = false
        })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getTableList(val)
    },
    handleSelectionChange (val) {
      console.log('val:' + JSON.stringify(val))
      this.multipleSelection = val
    },
    ...mapMutations([
      'setCrumbs',
      'userInfo'
    ])
  },
  components: {
    WTable,
    BaseButtonGroup,
    BaseButton,
    WGraph,
    WSelect,
    WTop5,
    WRow
    // WMessage
  }
}
</script>
<style>
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:150px;
    margin-right:6px;
  }
  .top5-title-fix .top5-title {
      padding-top: 15px;
      font-weight: 600;
  }
  .graph-content{
      height:initial;
      margin-top:0px;
  }
</style>