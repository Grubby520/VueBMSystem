<template>
  <div class="Table">
    <div class="Table-title">
        <!-- 标题-->
        <slot name="title"></slot>
        <!-- <a href="javascript:;" class="Table-toggle">
            <i class="Icon Icon-arrow-down"></i>
        </a> -->
    </div>
    <div class="Table-wrapper">
        <div class="Table-toolbar">
            <!--提示-->
            <div class="info">
              <slot name="info"></slot>
            </div>
            <!--操作-->
            <slot name="opt"></slot>
        </div>
        <div class="Table-list" v-Wloading="isLoading">
            <!--table list-->
            <slot name="table-list"></slot>
        </div>
    </div>
  </div>
</template>

<script>
import ExportCsv from '@/assets/js/components/export-csv'
import Csv from '@/assets/js/components/csv'
export default{
  props:{
    isLoading:false
  },
  data(){
    return {}
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    exportCsv (params) { // 文件名、数据
      if (params.data.length > 0) {
        if (params.filename) {
          if (params.filename.indexOf('.csv') === -1) {
            params.filename += '.csv'
          }
        } else {
          params.filename = 'table.csv'
        }

        let noHeader = false
        if ('noHeader' in params) noHeader = params.noHeader

        const data = Csv(params.columns, params.data, params, noHeader)
        if (params.callback) params.callback(data)
        else ExportCsv.download(params.filename, data)
      } else {
        alert('数据为空')
      }
    }
  },
  componets: {
    // Table
  }
}
</script>

<style lang="scss">
  @import '@/assets/scss/component/_var.scss';
  .el-table th.is-leaf {
      border-bottom: 1px solid $color-primary !important;
  }
  .el-table .tr:nth-of-type(2n+1) {
      background-color: #f9f9f9;
  }
  .el-table thead{
    border-top: 1px solid #ddd;
    background-color: #f9f9f9;
  }
  .el-table th{
    &::after{
      position: absolute;
      content: '';
      right: 0;
      top: 30%;
      width: 1px;
      height: 40%;
      background-color: #ccc;
    }

    &:nth-last-child(2)::after{
      background:red;
      width:0
    }
  }

  .el-table td, .el-table th{
    position: relative;
    color:$text-color;
    padding:7px 0px;
  }
  .el-pagination{
    text-align:right;
    padding-top: 7px;
  }
  .Table .el-input__icon{
    line-height: inherit;
  }
  .el-input--prefix .el-input__inner{
    padding-left: 30px !important;
    line-height:1 !important;
  }
   .Table .el-date-editor.el-input, .Table .el-date-editor.el-input__inner{
    width: 180px;
  }
  .el-table__empty-block{
    line-height:60px;
  }
</style>
