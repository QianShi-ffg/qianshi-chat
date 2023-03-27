<template>
  <view>
    <text class="title">{{ counter.count }}</text>
    <view class="button" @tap="onAdd">ADD</view>
    <button class="button" @top="sendOut">发 送</button>
  </view>
</template>

<script>
import { useCounterStore } from '../stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    const onAdd = () => {
      counter.count++
    }

    const sendOut = () => {
      counter.count++
    }

    return {
      counter,
      onAdd,
      sendOut
    }
  }
}
</script>

<style>
.title {
  font-size: 32px;
}
.button {
  border: 1px solid lightgray;
  padding: 5px 10px;
}
</style>
