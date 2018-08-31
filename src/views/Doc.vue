<template>
  <div style="margin-left:20px;">
    <h2>二级页面标题</h2>
    <w-title>流量-地域分布(一个月)</w-title>
    <h2>input 输入框</h2>
    <base-input placeholder="请输入"></base-input>
    <base-input size="mid" placeholder="请输入"></base-input>
    <base-input size="small" placeholder="请输入"></base-input>

    <h2>下拉框</h2>
    <h4>下拉框</h4>
    <w-select v-model="value" ref="select" :list="belongDepartment"></w-select>
    <h4>下拉框-可搜索</h4>
    <w-select filterable v-model="value" ref="select" :list="belongDepartment"></w-select>

    <h2>button</h2>
    <base-button >按钮</base-button>
    <base-button type="primery">按钮</base-button>
    <base-button type="warn">按钮</base-button>
    <base-button type="success">按钮</base-button>
    <base-button type="info">按钮</base-button>
    <base-button type="danger">按钮</base-button>

    <h2>label</h2>
    <base-label type="warn">状态</base-label>
    <base-label type="info">状态</base-label>
    <base-label type="danger">状态</base-label>
    <base-label class="large" type="danger">状态</base-label>
    <base-label type="danger" :isRadius="false" :isPointer="true">状态</base-label>

    <h2>message</h2>
    <base-button  @click="message" type="primery">按钮</base-button>

    <h2>块</h2>
    <w-row>
      <template slot="title">标题</template>
      <p slot="info">
          <i class="pageIconFont icon-audit-dqzczs"></i>
          当前资产总数：<span class="nbr" data-animation="true">692</span>个，异常资产总数：<span class="nbr" data-animation="true">0</span>个
      </p>
      <div slot="content">
        内容
      </div>
    </w-row>

    <h2>table</h2>
    <w-table>
        <template slot="title">流量报表</template>
        <div slot="info">提示信息</div>
        <template slot="opt">
          <form method="post" action="/flowReport/exportFlowReport">
            <lable-date-group></lable-date-group>
            <base-button-group>
              <base-button type="primery">查询</base-button>
              <base-button type="primery">导出</base-button>
            </base-button-group>
          </form>
        </template>
        <template slot="table-list">
            <div id="statement_table">
              table...
            </div>
        </template>
    </w-table>

    <h2>弹框</h2>
    <base-button @click="dialogVisible = true" >按钮</base-button>
    <w-dialog
      title="虚拟机配置仿真"
      :visible.sync="dialogVisible"
    >
      <w-form>
        <w-form-item label="请选择磁盘大小" is-required>
          <base-input />
        </w-form-item>
      </w-form>
      <div slot="footer">
        <base-button  @click="dialogVisible = false">取消</base-button>
        <base-button type="primery" >开始仿真</base-button>
      </div>
    </w-dialog>

    <h2>表单</h2>
    <w-form ref="ruleForm" :model="form" :rules="rules">
      <w-form-item name="user">
        <base-input v-model="form.user" iconPreFix="icon-user" placeholder="请输入用户名" />
      </w-form-item>
      <w-form-item  name="pwd">
        <base-input v-model="form.pwd" iconPreFix="icon-user" placeholder="请输入密码" />
      </w-form-item>
      <w-form-item>
        <base-button type="primary" @click="submitForm('ruleForm')">提交</base-button>
        <base-button @click="resetForm('ruleForm')">重置</base-button>
      </w-form-item>
    </w-form>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="ruleForm2.age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
     <h2>标签页</h2>
     <w-tabs :active-name="activeName" :handle-click="handleClick">
        <el-tab-pane label="流量告警" name="flow-alarm">
          流量告警
        </el-tab-pane>
        <el-tab-pane label="容量告警" name="capacity-alarm">
          容量告警
        </el-tab-pane>
      </w-tabs>
  </div>
</template>
<script>
import '@/assets/scss/_wishstack.scss'

import BaseInput from '@/components/common/base/BaseInput.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseButtonGroup from '@/components/common/base/BaseButtonGroup.vue'
import BaseLabel from '@/components/common/base/BaseLabel.vue'
import Message from '@/components/common/message/index.js'
import WSelect from '@/components/common/select/WSelect.vue'
import WForm from '@/components/common/form/WForm.vue'
import WFormItem from '@/components/common/form/WFormItem.vue'
import WRow from '@/components/common/WRow.vue'
import WTable from '@/components/common/WTable.vue'
import WDialog from '@/components/common/WDialog.vue'
import LableDateGroup from '@/components/common/lable-date-group/LableDateGroup.vue'
import WTitle from '@/components/common/WTitle.vue'
import WTabs from '@/components/common/WTabs.vue'

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

export default {
  data () {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      value: 3,
      dialogVisible: false,
      belongDepartment: [
        {
          'id': '04334157-c460-4373-a5c0-eae79e72f43f',
          'name': '四川省电子政务外网管理系统',
          'existExceptionFlow': true
        },
        {
          'id': '0cd2016d-6090-42c7-9e7a-0ea75377cde7',
          'name': '应急指挥平台-DNS系统',
          'existExceptionFlow': true
        },
        {
          'id': '0d564eac-4005-44d0-a97f-4d217796c941',
          'name': '应急指挥平台-模拟演练系统',
          'existExceptionFlow': true
        },
        {
          'id': '261237a6-98e5-4906-b35d-3db4a2c47494',
          'name': '政务信息资源交换共享平台管理系统',
          'existExceptionFlow': true
        }],
      form: {
        user: '',
        pwd: ''
      },
      rules: {
        user: [
          {
            validator (rule, value, callback) {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                // if (this.ruleForm.checkPass !== '') {
                //   this.$refs.ruleForm2.validateField('checkPass');
                // }
                callback()
              }
            }
          }
        ],
        pwd: [
          {
            validator (rule, value, callback) {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                // if (this.ruleForm2.checkPass !== '') {
                //   this.$refs.ruleForm2.validateField('checkPass');
                // }
                callback()
              }
            }
          }
        ]

      },

      ruleForm2: {
        pass: '',
        checkPass: '',
        age: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      activeName:'flow-alarm'
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    message () {
      Message('aaaaaa')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       alert('submit!')
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
    //   });
    // },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // }
  },
  components: {
    BaseInput,
    WSelect,
    BaseButton,
    BaseLabel,
    WRow,
    WTable,
    LableDateGroup,
    BaseButtonGroup,
    WDialog,
    WForm,
    WFormItem,
    WTitle,
    WTabs
  }
}
</script>
<style>
  .icon-user{
    background-image:url('~@/assets/image/icon-user.png');
    background-repeat: no-repeat;
  }
</style>
