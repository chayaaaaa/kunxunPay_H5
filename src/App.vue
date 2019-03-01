<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import "@/CSSFILE/common.css";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  },
  mounted() {
    this.$commonJS.inputBlur();
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  bottom: 0;
}
</style>
