<template>
  <div class="page__header--wrapper">
    <div class="page__header--substitute"></div>
    <div class="page__header--blackTheme clearfix">
      <img class="header__logoImg" :src="logoImg" alt="logo" />
      <h1 class="header__logoText"><img :src="logoText" alt="logoText" /></h1>
      <div class="header__loginInfo fr">
        <img class="loginInfo__userProfile" :src="profileImg" alt="用户头像" />
        <span class="loginInfo__userName">{{userInfo ? userInfo.realName:''}}</span>
        <img class="loginInfo__quit" @click="logout" :src="quitImg" alt="退出" title="退出" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      logoImg: require('@/assets/image/header/logo.png'),
      profileImg: require('@/assets/image/header/user_admin.png'),
      quitImg: require('@/assets/image/header/login_quit.png'),
      logoText: require('@/assets/image/header/logo_text.png')
    }
  },
  methods: {
    logout () {
      this.$http.get('/base/user/logout')
        .then((res) => {
          debugger

          this.$router.push({
            name: 'login'
          })
        })
        .catch((error) => {
          console.log(error)
          this.$router.push({
            name: 'login'
          })
        })
    }
  },
  computed: {
    ...mapState(['userInfo', 'isLogin'])
  }
}
</script>

<style lang="scss" scoped>
  /*scss采用BEM命令规范*/
  $uerNameColor:#b8cddf;
  $white:#fff;
  $gap:1em;
  $headerSize:50px;

  .page__header--substitute {
    height: $headerSize;
  }
  .page__header {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: $headerSize;
    line-height: $headerSize;
    padding: 0 0 0 0.5em;
    padding-right: 4%;
    box-sizing: border-box;
    overflow: hidden;

    .header__logoImg {
      max-height: 100%;
    }

    .header__logoText {
      display: inline-block;
      margin-left: 0.5em;
      font-size: 16px;
      color: $white;
    }

    .header__loginInfo {
      .loginInfo__userProfile {
        height: 18px;
      }

      .loginInfo__quit {
        @extend .loginInfo__userProfile;
        padding-left: $gap;
        border-left: 1px solid #666;
        &:hover {
          cursor: pointer;
        }
      }

      .loginInfo__userName {
        color: $uerNameColor;
        margin-left: 0.5em;
        margin-right: $gap;
      }
    }

    &--blackTheme {
      @extend .page__header;
      background: #25323e;
    }
  }
</style>
