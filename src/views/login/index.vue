<template>
  
  <div class="outerbox">
    <div class="loginBox">
      <div class="title">
        <p>智能仓储管理系统</p>
        <span>登录</span>
      </div>
      <div class="loginForm">
        <n-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-placement="left"
          label-width="100"
          require-mark-placement="right-hanging"
          :size="size"
          :style="{
            maxWidth: '640px'
          }"
        >
          <n-form-item label="" path="username">
            
            <n-input v-model:value="loginForm.username" placeholder="请输入账号" clearable >
              <template #prefix>
                <n-icon :component="PersonIcon"></n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item label="" path="password">
            <n-input v-model:value="loginForm.password" placeholder="请输入密码" type="password" show-password-on="click">
              <template #prefix>
                <n-icon :component="LockClosedIcon"></n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="capture" label="" path="capture">
            <n-input v-model:value="loginForm.capture" placeholder="请输入验证码" />
            <a 
              @click="getCaputreData"
              v-html="captureStr"
            ></a>
          </n-form-item>
        </n-form>
        <n-button class="loginBtn" @click="loginBtn" type="primary">登录 </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './index.scss'
import { ref, onMounted } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
const message = useMessage()
import { post, get } from '@/api/http'
import { icon } from '@/plugins'
import { TOKEN_KEY, MENU_KEY } from '@/config'
import { useStoreSetup } from '@/store/modules/user'
const userStore = useStoreSetup()
import { useRouter } from 'vue-router'
const router = useRouter()


const { PersonIcon, LockClosedIcon} = icon.ionicons5
const captureStr = ref<any>('')

//获取验证码
const getCaputreData = async () => {
  const result = await get('/capture')
  captureStr.value = result || '数据未加载'
}

//登录
const loginBtn = async () => {
  formRef.value?.validate(async (errors) => {
    if(errors?.length){
      errors.forEach((item: any) => {
        message.error(item[0].message)
      })
      formRef.value?.restoreValidation()
    }else{
      
      //登录
      const loginData = await post<any>('/login', loginForm.value)
      if(loginData?.status == 1){
        Object.assign(userStore.userInfo, loginData.data)
        localStorage.setItem(TOKEN_KEY, JSON.stringify(loginData?.data?.token))
        const menuData = await post('/router')
        localStorage.setItem(MENU_KEY, JSON.stringify(menuData.data))
        message.success('登录成功,欢迎回来~~')
        setTimeout(() => {
          router.push('/')
        },1000)
      }else{
        getCaputreData()
        loginForm.value.capture = ''
      }
    }
  })
  return
}


onMounted(() => {
  getCaputreData()
  
})

const formRef = ref<FormInst| null>(null)
const size = ref<'medium' | 'small' | 'large'>('large')
const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: ['input', 'blur']
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur']
  },
  capture: {
    required: true,
    message: '请输入验证码',
    trigger: ['input', 'blur']
  }
}
const loginForm = ref({
  username: '',
  password: '',
  capture:''
});



</script>
