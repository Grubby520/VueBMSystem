<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="24">
        <w-table>
          <template slot="title">单位流量列表</template>
          <template slot="opt">
            <div style="display: inline-block;margin-right: 6px;">
              <w-select filterable v-model="orgId" ref="select" :list="orgList"></w-select>
            </div>
            <base-button-group>
              <base-button @click="searchFn">查询</base-button>
            </base-button-group>
          </template>
          <template slot="table-list">
            <div>
              <el-table
                  :data="orgFlowList"
                  stripe
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="ID">
                  </el-table-column>
                  <el-table-column
                    prop="orgName"
                    label="单位">
                    <template slot-scope="scope">
                      <router-link :to="'/flow/analyze/detail/'+scope.row.orgId" class="a_link to_detail">
                        {{scope.row.orgName}}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="flowAll"
                    label="总流量(GB)">
                  </el-table-column>
                  <el-table-column
                    prop="flowAbnormal"
                    label="异常流量(GB)">
                    <template slot-scope="scope">
                      <router-link v-if="scope.row.flowAbnormal > 0" :to="'/flow/event'" class="a_link to_abnormal">
                        {{scope.row.flowAbnormal}}
                      </router-link>
                      <span v-else>{{scope.row.flowAbnormal}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="ipAll"
                    label="总访问IP数">
                  </el-table-column>
                  <el-table-column
                    prop="ipAbnormal"
                    label="异常访问IP数">
                  </el-table-column>
                  <el-table-column
                    prop="businessAll"
                    label="总业务系统数">
                  </el-table-column>
                  <el-table-column
                    prop="businessAbnormal"
                    label="异常流量业务系统数">
                    <template slot-scope="scope">
                      <span class="a_link to_abnormal">{{scope.row.businessAbnormal}}</span>
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
      </el-col>
    </el-row>
    <el-row :gutter="15" class="mt15">
      <el-col :span="12">
        <w-row>
          <template slot="title">总流量top5的单位</template>
          <div slot="content">
            <w-top5 :toplist="flowAllOrgTopList"></w-top5>
          </div>
        </w-row>
      </el-col>
      <el-col :span="12">
        <w-row>
          <template slot="title">异常流量top5的单位</template>
          <div slot="content">
            <w-top5 :toplist="flowAbnormalOrgTopList"></w-top5>
          </div>
        </w-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WRow from '@/components/common/WRow.vue'
import WTop5 from '@/components/common/WTop5.vue'
import WTable from '@/components/common/WTable.vue'
import WSelect from '@/components/common/select/WSelect.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
import API from '@/assets/js/api/api.js'
import Util from '@/assets/js/util/util.js'
import menuMixin from '@/components/mixins/menu_mixin.js'
export default{
  mixins: [menuMixin],
  data () {
    return {
      crumbs: [{
        iconClass: 'iconfont icon-flow',
        name: '互联网流量监管'
      }, {
        iconClass: 'iconfont icon-flow_analyze-management',
        name: '流量分析'
      }],
      orgId: '',
      orgList: [],
      orgFlowList: [],
      page: 1,
      pageSize: 20,
      total: 0,
      flowAllOrgTopList: [],
      flowAbnormalOrgTopList: []
    }
  },
  beforeCreate () {
    if (this.$store.state.userInfo.roleLevel == 3) {
      this.$router.push({path: '/flow/analyze/detail'})
    }
  },
  computed: {

  },
  methods: {
    currentChange: function (curPage) {
      this.page = curPage
      this.getOrgFlowList()
    },
    searchFn () {
      this.page = 1
      this.pageSize = 20
      this.getOrgFlowList()
    },
    getOrgList () {
      let vm = this
      API.getOrgList(vm, {page: 1, pageSize: 100000})
        .then(function (res) {
          if (res.data && res.data.body) {
            let _data = res.data.body
            vm.orgList = _data.data.map(function (ele) {
              return {
                name: ele.orgName,
                id: ele.orgId
              }
            })
          }
        })
    },
    getOrgFlowList () {
      let vm = this,
        _1H_Millisecond = 60 * 60 * 1000,
        _Day_Millisecond = 24 * _1H_Millisecond,
        _dateFormat = 'yyyy-MM-dd hh:mm:ss',
        now = new Date(),
        millisecond = now.getTime(),
        monthDays = Util.getMonthDays(now.getFullYear(), now.getMonth() == 0 ? 12 : now.getMonth()), // 获取上一月的天数
        timeStart = Util.dateFormat(new Date(now - monthDays * _Day_Millisecond), _dateFormat),
        timeEnd = Util.dateFormat(now, _dateFormat)

      API.getOrgFlowList(vm, {
        page: vm.page,
        pageSize: vm.pageSize,
        orgId: vm.orgId
        // timeStart: timeStart,
        // timeEnd: timeEnd
      })
        .then(function (res) {
          if (res.data && res.data.body) {
            let _data = res.data.body
            vm.orgFlowList = _data.data
            vm.page = _data.page
            vm.pageSize = _data.pageSize
            vm.total = _data.total
          }
        })
    },
    getFlowAllOrgTop5 () {
      let vm = this
      API.getFlowTop5(vm, 'flowAll', 'org', 5)
        .then(function (res) {
          if (res.data && res.data.body) {
            let _data = res.data.body,
              maxFlow = 0
            vm.flowAllOrgTopList = _data.map(function (ele, index) {
              let percentage = 0
              if (index == 0 && ele.flow > 0) {
                percentage = 100
                maxFlow = ele.flow
              } else {
                maxFlow > 0 ? percentage = Number(100 * ele.flow / maxFlow).toFixed(2) : 0
              }
              return {
                label: ele.name,
                text: ele.flow + 'GB',
                percentage: Number(percentage)
              }
            })
          }
        })
    },
    getFlowAbnormalOrgTop5 () {
      let vm = this
      API.getFlowTop5(vm, 'flowAbnormal', 'org', 5)
        .then(function (res) {
          if (res.data && res.data.body) {
            let _data = res.data.body,
              maxFlow = 0
            vm.flowAbnormalOrgTopList = _data.map(function (ele, index) {
              let percentage = 0
              if (index == 0 && ele.flow > 0) {
                percentage = 100
                maxFlow = ele.flow
              } else {
                maxFlow > 0 ? percentage = Number(100 * ele.flow / maxFlow).toFixed(2) : 0
              }
              return {
                label: ele.name,
                text: ele.flow + 'GB',
                percentage: Number(percentage)
              }
            })
          }
        })
    }
  },
  components: {
    WRow,
    WTop5,
    WTable,
    WSelect,
    BaseButton,
    BaseButtonGroup
  },
  mounted: function () {
    if (this.$store.state.userInfo.roleLevel == 1 || this.$store.state.userInfo.roleLevel == 2) {
      this.getOrgList()
      this.getOrgFlowList()
      this.getFlowAllOrgTop5()
      this.getFlowAbnormalOrgTop5()
    }
  }

}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/component/_var.scss';
  @import '@/assets/scss/component/_layout.scss';
  $white:#fff;
  $blue:#2196F3;
  $lightBlue:#70C0FF;
  $purple:#baa0e9;
  $lightPurple:#d1bcf7;
  $abnormalColor:#EF8888;

  .el-row {
    margin-left:0!important;
    margin-right:0!important;
  }

  .el-col {
    &:first-child {
      padding-left: 0!important;
    }

    &:last-child {
      padding-right: 0!important;
    }
  }

  .whiteBg {
    background: $white;
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
