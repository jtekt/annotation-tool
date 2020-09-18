<template>
  <div id="app">
    <AppTemplate application_name="Annotation tool" />
  </div>
</template>

<script>
import AppTemplate from '@/components/AppTemplate.vue'


export default {
  name: 'App',
  components: {
    AppTemplate
  },
  mounted(){
    this.$store.commit('parse_labels_from_env')
  }

}
</script>
