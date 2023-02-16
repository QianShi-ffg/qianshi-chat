<template>
  <view id="home">
    <view class="content">
      <view v-for="(item, index) in dataList" :key="index">{{ item }}</view>
    </view>
    <view class="input">
      <textarea name="" v-model="textareaVal"></textarea>
      <button @click="sendOut" :plain="true" type="primary">发 送</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const dataList = ref([])
const textareaVal = ref('')

const sendOut = () => {
  console.log(66666)
  dataList.value.push(textareaVal.value)
  textareaVal.value = ''
}
</script>

<style lang="scss">
#home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  background-color: red;
  .input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px 40px 30px;
    box-sizing: border-box;
    width: 100%;
    height: 160px;
    background-color: rgb(255, 255, 255);
    textarea {
      width: 80%;
      height: 60%;
      border-radius: 10px;
      background: #f5f5f5;
      resize:none;
      color: rgb(68, 68, 68);
      box-sizing: border-box;
      padding-top: 15px;
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      height: 50%;
      border: none;
      background: #3aa0c9;
      color: #fff;
      font-size: 22px;
    }
  }
  .content {
    flex: 1;
    width: 100%;
    overflow: scroll;
    background-color: #f5f5f5;
  }
}
</style>