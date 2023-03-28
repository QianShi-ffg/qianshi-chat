<template>
  <view id="home">
    <!-- <view class="content"> -->
      <scroll-view id="scrollview" class="content" ref="kcontent" :scroll-into-view="toView" :scroll-y="true" :enhanced="true">
        <view class="info" v-for="(item, index) in dataList" :key="index" :class="item.class" :id="`c-${index}`">
          <image src="../../images/user.png" v-if="item.class === 'rightInfo'"></image>
          <image src="../../images/ai.png" v-else></image>
          <view class="infoContent text-box">
            <view v-html="item.text" :user-select="true" :id="`text-${index}`">
            </view>
          </view>
        </view>
      </scroll-view>
    <!-- </view> -->
    <view class="input">
      <textarea name="" v-model="textareaVal" :showConfirmBar="false" :fixed="true" cursorSpacing="20px"></textarea>
      <view class="button send-btn" @tap="sendOut" v-if="!loading">
        <view>发 送</view>
      </view>
      <view class="button send-btn loading-btn" v-else>
        <view class="loading"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { chat } from "../../server/api";
import Taro from '@tarojs/taro'
const { marked } = require('marked');

const dataList = ref([]);
const textareaVal = ref("");
const toView = ref('');
const loading = ref(false);
let cache = ''

const sendOut = async () => {
  cache = textareaVal.value
  if (textareaVal.value && textareaVal.value !== '') {
    loading.value = true
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
    console.log(res.data.data[0].text, 56333)
    cache = ''
    dataList.value.push({
      text: marked(res.data.data[0].text),
      class: 'leftInfo'
    });
    loading.value = false
  }
};

// const dataListLength = computed(() => {
//   return dataList.value.length;
// })

watch(dataList.value, (newVal, oldVal) => {
    console.log(66522)
    toView.value = `c-${dataList.value.length - 1}`
    nextTick(()=>{
      Taro.createSelectorQuery()
      .select('#scrollview')
      .node()
      .exec((res) => {
        const scrollView = res[0].node;
        scrollView.scrollIntoView(toView.value)
      })
    })
})
</script>

<style lang="scss">
// :root {
//   --deg: 0deg;
// }
@property --deg {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
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
    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      width: 60px;
      height: 50%;
      border: none;
      background: #3aa0c9;
      color: #fff;
      font-size: 22px;
      padding: 0 25px;
      border-radius: 10px;
    }
    .loading-btn {
      background: #57b2d6;
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 42px;
        height: 42px;
        background-image: conic-gradient(from var(--deg), #57b2d6, #7dbbd3, rgba(255, 255, 255, 0.534), #fff);
        border-radius: 21px;
        animation: rotate 3s infinite linear;
        &::before {
          display: inline-block;
          background-color: #3aa0c9;
          width: 34px;
          height: 34px;
          content: '';
          border-radius: 17px;
        }
      }
    }
  }
  .content {
    flex: 1;
    width: 100%;
    overflow: scroll;
    background-color: #f5f5f5;
    padding: 20px 0px 20px;
    box-sizing: border-box;
    .kk {
      width: 100%;
    }
    .info {
      position: relative;
      display: flex;
      width: 100%;
      margin: 25px 0;
      padding: 0 30px;
      box-sizing: border-box;
      image {
        width: 80px;
        height: 80px;
        border-radius: 40px;
      }
      .infoContent {
        max-width: calc(100% - 200px);
        height: auto;
        padding: 20px;
        box-sizing: border-box;
        background: #3aa0c9cc;
        border-radius: 10px;
        text {
          word-wrap: break-word;
        }
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
        margin-left: 20px;
      }
      &::after {
        position: absolute;
        left: 102px;
        top: 27px;
        display: inline-block;
        content: '';
        border: 15px solid;
        border-color: transparent #a4cfe0cc transparent transparent;
      }
    }
    .rightInfo {
      justify-content: flex-start;
      direction: rtl;
      .infoContent {
        margin-right: 20px;
        direction: ltr;
      }
      &::after {
        position: absolute;
        right: 102px;
        top: 27px;
        display: inline-block;
        content: '';
        border: 15px solid;
        border-color: transparent transparent transparent #5fb1d2;
      }
    }
  }
}
@keyframes rotate {
  to {
    --deg: 360deg;
  }
}

</style>
