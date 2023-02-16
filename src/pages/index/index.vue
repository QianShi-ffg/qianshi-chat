<template>
  <view id="home">
    <view class="content">
      <scroll-view class="kk" ref="kcontent" :scroll-into-view="toView" :scroll-y="true">
        <view class="info" v-for="(item, index) in dataList" :key="index" :class="item.class" :id="`c-${index}`">
          <view class="infoContent">{{ item.text }}</view>
        </view>
      </scroll-view>
    </view>
    <view class="input">
      <textarea name="" v-model="textareaVal"></textarea>
      <view class="button" @tap="sendOut">发 送</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { chat } from "../../server/api";
import Taro from '@tarojs/taro'

const dataList = ref([]);
const textareaVal = ref("");
const toView = ref('');
let cache = ''

const sendOut = async () => {
  cache = textareaVal.value
  if (textareaVal.value && textareaVal.value !== '') {
    collect();
    dataList.value.push({
      text: cache,
      class: 'rightInfo'
    });
    textareaVal.value = '';
  } else {
    Taro.showToast({ title: '请输入内容', icon: "none" });
  }
};

const collect = async () => {
  console.log(cache, 666)
  const res = await chat({ message: cache });
  if (res.data.code === 200) {
    cache = ''
    dataList.value.push({
      text: res.data.data[0].text,
      class: 'leftInfo'
    });
  }
};

const dataListLength = computed(() => {
  return dataList.value.length;
})

watch(dataListLength, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    console.log(66522)
    toView.value = `c-${dataListLength.value - 1}`
  }
})
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
      resize: none;
      color: rgb(68, 68, 68);
      box-sizing: border-box;
      padding: 15px 15px 0;
    }
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      height: 50%;
      border: none;
      background: #3aa0c9;
      color: #fff;
      font-size: 22px;
      padding: 0 25px;
      border-radius: 10px;
    }
  }
  .content {
    flex: 1;
    width: 100%;
    overflow: scroll;
    background-color: #f5f5f5;
    padding: 20px 10px 0;
    box-sizing: border-box;
    .kk {
      width: 100%;
    }
    .info {
      display: flex;
      width: 100%;
      margin: 25px 0;
      .infoContent {
        width: auto;
        height: auto;
        padding: 20px;
        box-sizing: border-box;
        background: #3aa0c9cc;
        border-radius: 10px;
      }
    }
    .leftInfo {
      justify-content: flex-start;
      .infoContent {
        width: auto;
        height: auto;
        padding: 20px;
        box-sizing: border-box;
        background: #a4cfe0cc;
        border-radius: 10px;
      }
    }
    .rightInfo {
      justify-content: flex-end;
    }
  }
}
</style>
