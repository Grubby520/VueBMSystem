<template>
  <div>
    <el-row :gutter="15">
      <el-col :span="12">
        <w-row class="flex" title="业务系统资源预警">
          <template slot="content">
            <div class="webkit-box">
              <div class="flex app">
                <router-link to="/resource/business-config" tag="div" class="pageIconFont icon-load-high"></router-link>
                <p class='info'><span class="nbr high">?</span>个</p>
                <p>负载超高业务</p>
              </div>
              <div class="flex app">
                <router-link to="/resource/business-config" tag="div" class="pageIconFont icon-load-low"></router-link>
                <p class='info'><span class="nbr warning">?</span>个</p>
                <p>负载过低业务</p>
              </div>
              <div class="flex app">
                <router-link to="/resource/business-config" tag="div" class="pageIconFont icon-load-normal"></router-link>
                <p class='info'><span class="nbr">?</span>个</p>
                <p>负载正常业务</p>
              </div>
            </div>
          </template>
        </w-row>
      </el-col>
      <el-col :span="12">
        <w-row class="flex" title="虚拟机资源预警">
          <template slot="content">
            <div class="webkit-box">
              <div class="flex app">
                <router-link to="/resource/vm-config" tag="div" class="pageIconFont icon-warm-high"></router-link>
                <p class='info'><span class="nbr high">?</span>个</p>
                <p>高负荷</p>
              </div>
              <div class="flex app">
                <router-link to="/resource/vm-config" tag="div" class="pageIconFont icon-warm-low"></router-link>
                <p class='info'><span class="nbr">?</span>个</p>
                <p>空闲</p>
              </div>
              <div class="flex app">
                <router-link to="/resource/vm-config" tag="div" class="pageIconFont icon-waim-normal"></router-link>
                <p class='info'><span class="nbr">?</span>个</p>
                <p>正常</p>
              </div>
            </div>
          </template>
        </w-row>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="mt15">
      <el-col :span="24">
        <w-row class="flex">
          <template slot="title">
            平均负载（一周）
          </template>
          <template slot="content">
            <div id="trend">
            </div>
          </template>
        </w-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/* global $ */
import WRow from '@/components/common/WRow.vue'
import LableDateGroup from '@/components/common/lable-date-group/LableDateGroup.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
import WSelect from '@/components/common/select/WSelect.vue'
import { mapState } from 'vuex'
import { dateFormat } from '@/assets/js/components/utility.js'
import { urls } from '@/assets/js/api.js'
import WMessage from '@/components/common/message/index.js'
import menuMixin from '@/components/mixins/menu_mixin.js'
export default{
  mixins: [menuMixin],
  data () {
    return {
      value: null, // select 选择值
      crumbs: [{
        iconClass: 'iconfont icon-flow',
        name: '资源监管'
      }, {
        iconClass: 'iconfont icon-flow_overview-management',
        name: '容量分析'
      }],
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
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  },
  components: {
    WRow,
    LableDateGroup,
    BaseButton,
    BaseButtonGroup,
    WSelect
    // DropDown
  }
}
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/component/_var';
  .flex{
    flex:1;
  }
  .app{
    font-size:14px;
    text-align:center;
    color:$text-color-light;
    &:hover .pageIconFont{
      color:$color-primary;
      background:$color-primary-lighter;
    }
    .pageIconFont{
      width:75px;
      height:75px;
      background:#f6f6f6;
      border-radius:50%;
      display:inline-block;
      cursor:pointer;
      &:before{
        font-size: 30px;
        line-height: 75px;
      }
    }
    .info{
      margin-bottom:10px;
    }
    .nbr{
      font-size:20px;
      color:$color-success;
      &.high{
        color:$color-danger;
      }
      &.warning{
        color:$color-warning;
      }
    }
  }
  #trend{
    height:300px;
  }
</style>
