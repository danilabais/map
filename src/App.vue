<template>
  <div class="wrapper">
    <router-view :data="data" />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.wrapper {
  background: #333;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
</style>
