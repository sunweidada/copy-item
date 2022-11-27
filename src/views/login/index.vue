<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- tabindex 属性作用：输入框里面输入内容之后，摁下了 tab 键，他会自动转到下一个输入框 -->
        <!-- auto-complete：自动填充输入框内容的操作 on 表示开启  off 表示关闭 -->
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 密码的输入框 -->
        <!-- .native 其实一个修饰符，native 表示原生的意思 -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" class="loginBtn" @click.native.prevent="handleLogin">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex'

// 给表单添加验证规则
// 1、表单组件身上表单数据对象：model rules
// 2、表单项组件：el-form-item prop="规则的字段名"

export default {
  name: 'Login',
  data() {
    // 添加 手机号的自定义校验规则
    const validatemobile = (rule, value, cb) => {
      // 用法：cb 是一个回调函数，不论验证成功还是失败，这个 cb 都需要执行
      // value 通过校验 ? cb() : cb(new Error('错误的原因'))

      validMobile(value) ? cb() : cb(new Error('手机号不合法'))
    }

    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        // 通过 validator 添加自定义校验规则，对应的值是一个函数，该函数的参数是固定的（规则，当前你验证的那个值，cb）
      // 1、密码不能为空  2、密码的长度应该在 6 - 15 个字符之间
        mobile: [{ required: true, trigger: 'blur', validator: validatemobile }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 6, max: 15, trigger: 'blur', message: '密码的长度应该在 6 - 15 个字符之间' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  /**
   * 问题：
   * 1、请求路径：VUE_APP_BASE_API = '/api' 我们要改成 /api
   * 2、TypeError: Object(...) is not a function   在说你引入了一个文件里面根本就没有属性或者是方法( 要检查有没有叫这个名字的方法 )
   * 3、引入的路径：@/api/user  @ 后面一定要加 /
   * 4、代理的时候，你要代理的路径：'^/api' 中间的 / 也不能丢
   * 5、由于已经在响应拦截器里面将服务器返回的数据解构了，那登录成功之后返回的就是 token，不需要解构了
   *      debugger 灵活运用一下
   * 6、permission.js 里面的内容需要自行注释，后面我们自己加
   */
  mounted() {
    // 测试 user action 是否可用
    // this.$store.dispatch('user/userLogin', this.loginForm)
  },
  methods: {
    ...mapActions(['user/userLogin']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      try {
        this.loading = true
        // 验证表单
        await this.$refs.loginForm.validate()
        // 再去请求
        const res = await this['user/userLogin'](this.loginForm)

        // 当 action 请求成功之后，再做跳转
        res && this.$router.push('/')
      } finally {
        // 验证失败之后，也要关闭按钮的 loading 效果
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // 设置背景图片
  // 在 css 样式里面也可以书写 @ 别名，不过前面的 ~ 符号，一定要加
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }

  .el-form-item__error {
    color: #fff;
  }

  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
