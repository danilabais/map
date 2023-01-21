<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["fetchRoutes"]),
  },
  created() {
    this.fetchRoutes();
  },
};
</script>

<style scoped>
.wrapper {
  background: #333;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}
</style>
