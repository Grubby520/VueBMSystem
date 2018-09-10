<template>
  <div class="content-container">
    <w-tabs :active-name="activeName" :handle-click="handleClick">
      <el-tab-pane label="流量告警" name="flow-alarm">
        <w-table>
          <template slot="title">流量告警列表</template>
          <div slot="opt">
            <el-date-picker
              v-model="flowStartDate"
              type="datetime"
              name="flowStartDate"
              placeholder="选择开始时间"
              @change="dateChange">
            </el-date-picker>
            <el-date-picker
              v-model="flowEndDate"
              type="datetime"
              name="flowEndDate"
              placeholder="选择结束时间"
              @change="dateChange">
            </el-date-picker>
            <div style="display: inline-block;margin-right: 6px;vertical-align:middle">
              <w-select filterable v-model="flowAlarmLevel" ref="select" :list="alarmLevelList"></w-select>
            </div>
            <base-button-group>
              <base-button @click="loadAlarmList()">查询</base-button>
            </base-button-group>
          </div>
          <template slot="table-list">
            <div>
              <el-table
                  :data="flowAlarmList"
                  stripe
                  style="width: 100%">
                  <el-table-column
                    prop="time"
                    label="告警时间">
                  </el-table-column>
                  <el-table-column
                    prop="level"
                    label="告警级别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.levelCode == 2" class="label-btn low">{{scope.row.level}}</span>
                        <span v-else-if="scope.row.levelCode == 1"  class="label-btn warning">{{scope.row.level}}</span>
                        <span v-else-if="scope.row.levelCode == 0" class="label-btn high">{{scope.row.level}}</span>
                        <span v-else class="label-btn high">未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="businessName"
                    label="告警对象">
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    label="告警信息">
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
  </div>
</template>
<script>
import API from '@/assets/js/api/api.js'
import Util from '@/assets/js/util/util.js'
import WTabs from '@/components/common/WTabs.vue'
import WTable from '@/components/common/WTable.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
import WSelect from '@/components/common/select/WSelect.vue'
import menuMixin from '@/components/mixins/menu_mixin.js'
export default {
  mixins: [menuMixin],
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-operationAdministration',
        name: '运维管理'
      }, {
        iconClass: 'iconfont icon-Notice-management',
        name: '告警管理'
      }, {
        iconClass: '',
        name: '告警事件'
      }],
      activeName: 'flow-alarm',
      flowStartDate: null,
      flowEndDate: null,
      flowAlarmLevel: '',
      total: 0,
      page: 1,
      pageSize: 20,
      flowAlarmList: [],
      alarmLevelList: [{
        id: '0',
        name: '严重'
      }, {
        id: '1',
        name: '一般'
      }, {
        id: '2',
        name: '轻微'
      }]
    }
  },
  components: {
    WTabs,
    WTable,
    BaseButton,
    BaseButtonGroup,
    WSelect
  },
  computed: {

  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    currentChange: function (curPage) {
      this.page = curPage
      this.getAlarmList()
    },
    getAlarmList () {
      let vm = this
      API.getAlarmList(vm, {
        page: vm.page,
        pageSize: vm.pageSize,
        levelCode: vm.flowAlarmLevel,
        timeStart: vm.flowStartDate ? Util.dateFormat(vm.flowStartDate, 'yyyy-MM-dd hh:mm:ss') : vm.flowStartDate,
        timeEnd: vm.flowEndDate ? Util.dateFormat(vm.flowEndDate, 'yyyy-MM-dd hh:mm:ss') : vm.flowEndDate
      })
        .then(function (res) {
          if (res.data && res.data.body) {
            vm.total = res.data.body.total
            vm.page = res.data.body.page
            vm.pageSize = res.data.body.pageSize
            vm.flowAlarmList = res.data.body.data
          }
        })
    },
    loadAlarmList () {
      let vm = this
      vm.page = 1
      this.getAlarmList()
    },
    dateChange() {
      let timeStart = this.flowStartDate ? Util.dateFormat(this.flowStartDate, 'yyyy-MM-dd hh:mm:ss') : this.flowStartDate,
        flowEndDate = this.flowEndDate ? Util.dateFormat(this.flowEndDate, 'yyyy-MM-dd hh:mm:ss') : this.flowEndDate

      if (timeStart && flowEndDate) {
        if (timeStart > flowEndDate) {
          this.$message.error('开始时间不能大于结束时间')
          this.flowStartDate = null
          this.flowEndDate = null
        }
      }
    }
  },
  mounted () {
    this.getAlarmList()
  }
}
</script>
<style lang="scss" scoped>
  $blue:#2196F3;
  $red:#e62b2d;
  $yellow:#ffb438;

 .label-btn.high {
    background:$red;
  }

  .label-btn.warning {
    background:$yellow;
  }

  .label-btn.normal {
    background: $blue
  }

  .content-container {
    padding: 0 15px;
    background: #fff;
  }

  .el-date-editor.el-input{
    margin-right:6px;
    width: 180px;
    /deep/ .el-input__inner{
      width: 100%;
    }
  }
</style>
