<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <DonationForm />
  </div>
</template>

<script>
import DonationForm from "./components/DonationForm.vue"

export default {
  name: "App",
  components: {
    DonationForm,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
