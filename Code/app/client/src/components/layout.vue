<template>
  <div class="root">
    <navbar class="nav" ></navbar>
    <layout-view ref="layout" v-bind:id="layout_id"></layout-view>
    <br><br>
    <center><p class="lead">welcome to the unexplored area...</p></center>
  </div>
</template>
<style lang="scss" scoped>
  .root {
    width : 100%;
    height : 100%;
    display : flex;
    flex-direction : column;
      .nav {
        flex : 0 0 auto;
      }
      .layout {
        flex : 1;
      }

  }
</style>

<script>
import layoutView from "./components/layout_view.vue"
import navbar from './components/navbar.vue'

export default {
  components : {
    // layoutView,
    navbar
  },
  watch: {
    // call again the method if the route changes
    // '$route': 'getLayout'
  },

  methods : {
    // getLayout(){
    //   this.$refs.layout.closeModal();
    //   this.$refs.layout.getLayoutById(this.$route.params.id);
    // },
    //
    // getLayoutById(){
    //
    // }
  },

  data : function(){
    return {
      layout_id:""
    }
  },
  mounted : function(){
    // this.getLayout();
    layout_id = this.$route.params.id;
    console.log(this.$route.params.id)
  }
}
</script>
