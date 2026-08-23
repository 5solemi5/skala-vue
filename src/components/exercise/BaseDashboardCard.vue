<template>
  <!-- 검색박스와 리스트박스가 공유하는 껍데기. 내용은 부모가 slot 으로 주입한다. -->
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  padding: 18px 20px;
  margin-bottom: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
}
</style>
