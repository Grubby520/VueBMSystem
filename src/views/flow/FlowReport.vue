<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="24">
        <w-table ref="table" :isLoading="isLoading">
          <template slot="title">流量报表</template>
          <template slot="opt">
            <form method="post" action="/flowReport/exportFlowReport">
              <lable-date-group @click="lableChange"></lable-date-group>
              <input type="hidden" name="type" :value="type">
              <el-date-picker v-show="type == 0"
                v-model="reportDate"
                type="date"
                name="statisticsDate"
                format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
              <el-date-picker v-show="type == 1"
                v-model="reportDate"
                type="week"
                firstDayOfWeek="1"
                name="statisticsDate"
                format="yyyy-MM-dd"
                placeholder="选择周">
              </el-date-picker>
              <el-date-picker v-show="type == 2"
                v-model="reportDate"
                name="statisticsDate"
                format="yyyy-MM-dd"
                type="month"
                placeholder="选择月">
              </el-date-picker>

              <div style="display: inline-block;margin-right: 6px;vertical-align:middle">
                <w-select :placeholder="this.userInfo.roleLevel == 1 || this.userInfo.roleLevel == 2 ? '查询所有单位':'查询所有业务系统'" filterable v-model="value" ref="select" :list="selectList"></w-select>
              </div>
              <base-button-group>
                <base-button @click="getTableList(1)">查询</base-button>
                <base-button @click="exportCsv()">导出</base-button>
                <!-- <button type="submit" class="Btn Btn-default" @click="exportFile" >导出</button> -->
              </base-button-group>
            </form>
          </template>
          <template slot="table-list">
              <div id="statement_table">
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                      prop="businessName"
                      label="业务系统名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="orgName"
                      label="所属单位"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="flowAll"
                      label="总流量（GB）">
                    </el-table-column>
                    <el-table-column
                      prop="flowAbnormal"
                      label="异常流量（GB）">
                    </el-table-column>
                    <el-table-column
                      prop="ipAll"
                      label="总访问IP数">
                    </el-table-column>
                    <el-table-column
                      prop="ipAbnormal"
                      label="异常访问IP数">
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-show="pageTotal > 20"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[20]"
                    layout="total, prev, pager, next, jumper"
                    :total="pageTotal">
                </el-pagination>
              </div>
          </template>
        </w-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/* global $ */
import WTable from '@/components/common/WTable.vue'
import LableDateGroup from '@/components/common/lable-date-group/LableDateGroup.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
import WSelect from '@/components/common/select/WSelect.vue'
import { mapState } from 'vuex'
import { dateFormat } from '@/assets/js/components/utility.js'
import { urls } from '@/assets/js/api/api.js'
import WMessage from '@/components/common/message/index.js'
import menuMixin from '@/components/mixins/menu_mixin.js'
export default{
  mixins: [menuMixin],
  data () {
    return {
      value: null, // select 选择值
      crumbs: [{
        iconClass: 'iconfont icon-flow',
        name: '互联网流量监管'
      }, {
        iconClass: 'iconfont icon-flow_overview-management',
        name: '流量报表'
      }],
      isLoading: true,
      currentPage: 1,
      pageTotal: 0,
      allColumns: [
        {
          key: 'businessName',
          title: '业务系统名称'
        },
        {
          key: 'orgName',
          title: '所属单位'
        },
        {
          key: 'flowAll',
          title: '总流量（GB）'
        },
        {
          key: 'flowAbnormal',
          title: '异常流量（GB）'
        },
        {
          key: 'ipAll',
          title: '总访问IP数'
        },
        {
          key: 'ipAbnormal',
          title: '异常访问IP数'
        }
      ],
      tableData: [],
      reportDate: new Date(),
      type: 0, // 0 1 2
      selectList: [],
      orgType: ''
    }
  },
  beforeCreated () {
    // this.reportDate = new Date()
  },
  created () {

  },
  mounted () {
    this.getSelectList()
    this.getTableList()
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    getSelectList () {
      if (this.userInfo.roleLevel == 1 || this.userInfo.roleLevel == 2) {
        this.$http.get(urls.orgList, {}) // 部门
          .then((res) => {
            if (res.data.body.data.length > 0) {
              this.selectList = res.data.body.data.map((item) => {
                return {name: item.orgName, id: item.orgId}
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        this.$http.get(urls.businessList, { // 业务
          params: {
            pageSize: 9999999,
            page: 1
          }
        })
          .then((res) => {
            if (res.data.body.data.length > 0) {
              this.selectList = res.data.body.data.map((item) => {
                return {name: item.businessName, id: item.businessId}
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    lableChange (evt) {
      this.type = evt.target.getAttribute('type')
    },
    getTableList (page = 1, pageSize = 20) {
      return this.$http.get(urls.flowReport, {
        params: {
          page: page, //
          pageSize: pageSize, //
          date: dateFormat(this.reportDate, 'yyyy-MM-dd'),
          type: this.type,
          id: this.value
        }
      })
        .then((res) => {
          console.log(res)
          this.tableData = res.data.body.data
          this.pageTotal = res.data.body.total
          return res
        })
        .catch((error) => {
          console.log(error)
          return error
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    search () {

    },
    forMartTime (time) {
      // return time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()
    },
    exportCsv () {
      this.getTableList(null, 99999)
        .then(res => {
          if (res.data.body.data.length > 0) {
            this.$refs.table.exportCsv({
              filename: '流量报表',
              columns: this.allColumns,
              data: res.data.body.data
            })
          } else {
            WMessage({
              message: '暂无数据',
              type: 'error'
            })
          }
        })
        .catch(error => {
          console.log(error)
          throw new Error(error)
        })
        // this.$refs.table.exportCsv({
        //       filename: '流量报表',
        //       columns: this.allColumns,
        //       data: [{businessName:1,orgName:1,flowAll:1,flowAbnormal:1,ipAll:1,ipAbnormal:2}]
        //     })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  },
  components: {
    WTable,
    LableDateGroup,
    BaseButton,
    BaseButtonGroup,
    WSelect
    // DropDown
  }
}
</script>
<style>
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:150px;
    margin-right:6px;
  }
</style>
