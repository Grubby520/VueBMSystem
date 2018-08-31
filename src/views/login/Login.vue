<template>
  <div class="login-bg">
      <div class="login">
          <div class="login-left"></div>

          <div class="login-right">
              <div class="logo">
                  <div class="logo-1">
                      <img src='../../assets/image/logo-bule.png' alt=""/>
                  </div>
              </div>
              <div id="" name="login_form" method="POST" data-resulttype="JSON" autocomplete="off" class="user-submits form-wrapper">
                <w-form ref="loginForm" :model="form" :rules="rules">
                  <w-form-item name="username">
                    <base-input v-model="form.username" :is-radius="true" iconPreFix="icon-home_page-management iconfont" placeholder="请输入用户名" />
                  </w-form-item>
                  <w-form-item  name="password">
                    <base-input type="password" :is-radius="true" v-on:keyup="submitForm('loginForm')" v-model="form.password" iconPreFix="iconfont icon-AuthM-management" placeholder="请输入密码" />
                  </w-form-item>
                  <w-form-item>
                    <base-button :is-radius="true" size="large"  @click="submitForm('loginForm')">登录</base-button>
                  </w-form-item>
                </w-form>
              </div>
          </div>
      </div>
      <div class="footer">
          2016-2017 中国电子科技网络信息安全有限公司 版本所有<br/>
          China Electronics Technology Cyber Security Co.,Ltd.
      </div>
      <ul class="download Hover">
          <li class="subset"><a href="#">
            <img src="@/assets/image/ziliao.png" alt="证书下载"/>
          </a></li>
          <li class="subset">
              <img src="@/assets/image/qudong.png" alt="驱动下载"/>
              <ul class="details certificate">
                  <li><h2>驱动下载</h2></li>
                  <li class="bright">
                    <a href="/driver/海泰证书驱动.exe">
                    <img src="@/assets/image/control.png" />
                    海泰</a>
                  </li>
                  <li class="bright">
                    <a href="/driver/吉大正元认证控件.exe">
                      <img src="@/assets/image/drive.png" />
                      吉大正元
                    </a>
                  </li>
                  <li class="bright">
                    <a href="/driver/飞天诚信USB_Token.exe">
                    <img src="@/assets/image/usb.png" />
                    飞天诚信</a>
                  </li>
              </ul>
          </li>
          <li class="subset">
              <img src="@/assets/image/ie_1.png" alt="浏览器下载"/>
              <ul class="details browser">
                  <li><h2>浏览器下载</h2></li>
                  <li class="bright">
                    <a href="http://xiazai.sogou.com/comm/redir?softdown=1&u=G30HdQ8G4ngTKaCLatOMi9NT20YVGMg4iIfQJ_j_ab3KkwSKrlCr87USqxfMhNK7Qn1-9TfcmHJjYyLcIhWYQYaRwjn4ctoiEHD5OLOUqSMNrKZuZ8RmxYm_KiRhAu_oy6rGmVCuxuQ.&pcid=-663866167220463725">
                        <img src="@/assets/image/IE.png" />
                      IE浏览器
                    </a>
                  </li>
                  <li class="bright"><a href="http://xz.cr173.com/soft1/chromium.zip">
                <img src="@/assets/image/goole.png" />
              谷歌浏览器</a></li>
                  <li class="bright">
                    <a href="http://xiazai.sogou.com/comm/redir?softdown=1&u=0Gd8piB6091kOtbAhntD_rVA6-Qzcjd-GnhY9F93jP6tw1Tf9r6M_3JqJNdzuXl_Nhvrga1WszTCkB5PKiDNdlKIL-87fUvAZ5PVOlM1V8gd1VAs6MOxQRpFYJGOYHtCUT1KSL-7aaIu3Y-DzX7dVPk5HCegCs5q&pcid=-7066967717758185116&filename=Firefox-setup.exe&w=1907">
                      <img src="@/assets/image/firefox.png" />
                      火狐浏览器
                    </a>
                  </li>
              </ul>
          </li>
          <li class="but-parent but-download">
            <img src="@/assets/image/but-download.png" alt=""/>
          </li>
      </ul>
      <ul class="service Hover">
          <li class="subset">
              <img src="@/assets/image/email.png" alt=""/><span>服务邮箱</span>
              <div class="details service-email">
                <div class="nav-line">
                  <div>scszwy01@westone.com.cn</div>
                  <span>（移动&华三云）</span>
                </div>
                <div class="nav-line">
                  <div>scszwy02@westone.com.cn</div>
                  <span>（电信&腾讯云）</span>
                </div>
                <div class="nav-line">
                  <div>scszwy03@westone.com.cn</div>
                  <span>（故障、安全和备案）</span>
                </div>
              </div>
          </li>
          <li class="subset">
              <img src="@/assets/image/qq.png" alt=""/><span>服务QQ</span>
              <div class="details service-QQ">
                  <p>2313755981</p>
                  <p>（移动&华三云）</p>
                  <p>2662655245 </p>
                  <p> (电信&腾讯云)</p>
                  <p>2049420083</p>
                  <p>（故障、安全和备案）</p>
              </div>
          </li>
           <li class="subset">
              <img src="@/assets/image/wechat.png" alt=""/><span>微信</span>
              <div class="details wechat-qr">
                <img  src="@/assets/image/wechat_2.jpg" alt=""/>
              </div>
          </li>
          <li class="but-parent but-service">
            <img src="@/assets/image/but-service.png" alt=""/>
          </li>
      </ul>
      <ul class="service phone Hover">
          <li class="subset">
              <img src="@/assets/image/jiandu.png" alt=""/><span>监督电话</span>
              <div class="details supervision-phone">800-886-3030</div>
          </li>
          <li class="subset">
              <img src="@/assets/image/fuwudianhua.png" alt=""/><span>服务电话</span>
              <div class="details service-QQ" style='width:190px;'>
                  <p>86606010/86606358转801</p>
                  <p>（移动&华三云）</p>
                  <p>86606010/86606358转802</p>
                  <p> (电信&腾讯云)</p>
                  <p>86606010/86606358转803</p>
                  <p>（故障、安全和备案）</p>
              </div>
          </li>
          <li class="but-parent but-service">
            <img src="@/assets/image/call.png" alt=""/>
          </li>
      </ul>
  </div>
</template>
<script>
/* global $ */
import { mapActions } from 'vuex'
import WForm from '@/components/common/form/WForm.vue'
import WFormItem from '@/components/common/form/WFormItem.vue'
import BaseInput from '@/components/common/base/BaseInput.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
export default{
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            validator (rule, value, callback) {
              if (value === '') {
                callback(new Error('请输入用户名'))
              } else {
                // if (this.ruleForm.checkPass !== '') {
                //   this.$refs.ruleForm2.validateField('checkPass');
                // }
                callback()
              }
            }
          }
        ],
        password: [
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
      }
    }
  },
  created () {
    this.$store.commit('logout')
  },
  mounted () {
    this.$nextTick(() => {
      // 鼠标移入移出but效果
      $('.Hover').on('mouseover', function () {
        $(this).find('.subset').css({
          'display': 'block'
        })
        $(this).find('.but-parent').css('background-color', '#04b8f8')
      }).on('mouseout', function () {
        $(this).find('.subset').css('display', 'none')
        $(this).find('.but-parent').css('background-color', '#00518a')
      })

      // 鼠标移入显示详细信息
      $('.subset').on('mouseover', function () {
        $(this).find('.details').css('display', 'block')
      }).on('mouseout', function () {
        $(this).find('.details').css('display', 'none')
      })
    })
  },
  methods: {
    submitForm (formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.getUserInfo(_this.form)
            .then((res) => {
              debugger
              console.log(res)
              // window.sessionStorage.setItem('loginUserBaseInfo',JSON.stringify(Object.assign(res.data.body, {lifeTime:60})))
              this.$router.push({
                path: '/flow/overview'
              })
            })
            .catch((res) => {
              console.log(res)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    ...mapActions([
      'getUserInfo'
    ])

  },
  components: {
    WForm,
    WFormItem,
    BaseInput,
    BaseButton
  }
}
</script>
<style lang="scss">
  .form-row button{
    width:100%;
  }
  .login_hint{
    font-size:12px;
    line-height:56px;
  }
  .back-red{
    background-color:#f9c7c8;
  }
  .login-bg{
      position: absolute;
      width: 100%;
      height: 100%;
      min-height: 660px;
      background-image:url('~@/assets/image/login-3.jpg');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      min-width: 1312px;
  }
  .login{
      width: 832px;
      height: 508px;
      position: absolute;
      z-index:1;
      top: 50%;
      left: 50%;
      margin-top: -254px;
      margin-left: -416px;
      border-radius: 6px;
      overflow: hidden;
  }
  .login-left{
      width: 50%;
      height: 508px;

      background-image: url('~@/assets/image/login-left.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      z-index: 999;
  }
  .login-right{
      width: 50%;
      height: 508px;
      padding-top: 100px;
      position: absolute;
      right: 0;
      z-index: 999;
      background-color:#ffffff;
  }
  .logo{
      text-align: center;
  }
  .logo-2{
      margin-top: 24px;
  }
  .user-submits{
      margin-top: 50px;
      text-align: center;
  }
  .user-name,
  .user-password{
      width: 100%;
      height: 46px;
      text-align: center;
      position: relative;
  }
  .user-password{
      margin: 28px 0;
  }
  // .user-submits input{
  //     width: 284px;
  //     height: 46px;
  //     border: none;
  //     border-radius: 23px;
  //     -moz-border-radius: 23px;
  //     -webkit-border-radius: 23px;
  //     outline: none;
  //     background-color: #eeeeee;
  //     font-size: 16px;
  //     color: #777777;
  //     padding-left: 54px;
  //     font-family: "微软雅黑";
  // }
  .form-wrapper{
    width:300px;
    margin:60px auto;
  }
  .icon-user,
  .icon-password{
      width: 30px;
      height: 30px;
      position: absolute;
      left: 76px;
      top: 9px;
      overflow: hidden;
      img{
        width:initial;
      }
  }
  .footer{
      width: 100%;
      position: absolute;
      bottom: 20px;
      text-align: center;
      color: #FFFFFF;
      opacity: 0.5;
      font-size: 14px;
      font-family: "Microsoft YaHei","lucida Grande",Verdana,Arial,Helvetica,Sans-serif,"\u5b8b\u4f53";
  }
  /*图片居中*/
  .download img,
   img{
      vertical-align: middle;
  }
  .download li,
  .service li{
      text-align: center;
      line-height: 60px;
  }
  /*hover效果*/
  .Hover .subset:hover{
      background-color: #00518a;
  }
  .download{
      margin: 0;
      padding: 0;
      list-style: none;
      position: absolute;
      z-index:99;
      right: 30px;
      bottom: 160px;
      cursor: pointer;
  }
  .download li{
      width: 60px;
      height: 60px;
  }
  .subset{
      background-color:#075e9a;
  }
  .subset .details{
      font-size: 12px;
      font-family: "微软雅黑";
      background-color: #00518a;
  }
  .service{
      list-style: none;
      position: absolute;
      z-index:99;
      right: 30px;
      bottom: 90px;
      margin: 0;
      padding: 0;
      cursor: pointer;
  }
  .service.phone{
      list-style: none;
      position: absolute;
      z-index:99;
      right: 30px;
      bottom: 20px;
      margin: 0;
      padding: 0;
      cursor: pointer;
  }
  .service li{
      float: left;
      font-size: 14px;
      color: #FFFFFF;
      opacity: 0.8;
      font-family: "微软雅黑";
  }
  .but-service,
  .but-download{
      width: 60px;
      height: 60px;
      background-color: #00518a;
  }
  .service .subset{
      padding: 0 20px;
  }
  .service .subset>img{
      margin-right: 10px;
  }
  .download .subset,
  .service .subset{
      display:none;
      position: relative;
  }
  .service-telephone,
  .supervision-phone{
      width: 168px;
      height: 60px;
      position: absolute;
      top: -65px;
      left: -20px;
      display: none;
  }
  .service-telephone:before,
  .supervision-phone:before,
  .service-email:before{
      content: "";
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #00518a;
      position: absolute;
      bottom:-5px;
      left: 50%;
      margin-left: -5px;
  }
  .wechat-qr{
      width: 120px;
      position: absolute;
      top: -85px;
      left: -10px;
      background-color: transparent!important;
      display: none;
  }
  .wechat-qr>img{
    width:80px;
  }
  .service-email{
     padding:10px 10px 10px 10px;
   /*  height: 30px;*/
     line-height:20px;
      position: absolute;
      top: -150px;
      right: -20px;
      display: none;
  }
  .service-QQ{
      padding: 10px;
      position: absolute;
      top: -211px;
      right: 0px;
      background-color: #00518a;
      padding-top:20px;
      display: none;
      width:140px;
  }
  .service-QQ>p{
      margin:0;
      padding: 0;
      height: 16px;
       line-height: 16px;
      font-size: 12px;
      font-family: "微软雅黑";
  }
  .service-QQ>p:nth-of-type(2n){
  padding-bottom: 20px;
  border-bottom:1px solid #ccc;
  margin-bottom:5px;
  }
  .service-QQ:before{
      content: "";
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-right: 5px solid #00518a;
      position: absolute;
      bottom:-5px;
      left: 50%;
      margin-left: 20px;
  }
  /*下载详情*/
  .certificate,
  .browser{
      width: 115px;
      margin: 0;
      padding: 0;
      list-style: none;
      position: absolute;
      left:-115px;
      top: -40px;
      display: none;
  }
  .certificate{
      width: 115px;
      margin: 0;
      padding: 0;
      list-style: none;
      position: absolute;
      left:-115px;
      top: -40px;
      display: none;
  }
  .certificate:before,
  .browser:before{
      content: "";
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid #075e9a;
      position: absolute;
      right: 0;
      bottom:50%;
      margin-left: 20px;
  }
  .certificate li,
  .browser li{
      width: 110px;
      height: 38px;
      background-color: #075e9a;
      line-height: 38px;
      font-size: 14px;
      color: #FFFFFF;
      font-family: "微软雅黑";
  }
  .certificate li>a,
  .browser li>a{
    color:#FFFFFF;
  }
  .certificate li>a:hover,
  .browser li>a:hover{
    color:#FFFFFF;
  }
  .certificate .bright:hover,
  .browser .bright:hover{
      background-color: #00518a;
  }
  .certificate h2,
  .browser h2{
      width: 110px;
      height: 38px;
      margin: 0;
      border-bottom: 1px solid #1c6497;
      line-height: 38px;
      font-size: 14px;
      color: #FFFFFF;
      font-family: "微软雅黑";
  }
  .nav-line{
    border-bottom:1px solid #ccc;
  }
</style>
