<template>
  <div class="collection_item">
    <img
      :class="{zoomed: zoomed}"
      :src="image_src"
      @click="zoomed = !zoomed">
    <div class="controls_wrapper">


      <div class="">
        <label>OK</label>
        <input type="radio" v-model="item.annotation" value="OK" :disabled="processing">
        <span v-if="success && item.annotation === 'OK'">✅</span>
      </div>
      <div class="">
        <label>NG</label>
        <input type="radio" v-model="item.annotation" value="NG" :disabled="processing">
        <span v-if="success && item.annotation === 'NG'">✅</span>
      </div>




    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectionItem',
  props: {
    item: Object
  },
  data() {
    return {
      zoomed: false,
      processing: false,
      success: false,
    }
  },
  methods: {
    update_item(){
      this.processing = true
      let api_url = process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL
      let collection = this.$route.params.collection
      let entry_id = this.item._id
      let url = `${api_url}/collections/${collection}/${entry_id}`

      this.axios.put(url, this.item)
      .then( () => {
        this.success=true
        setTimeout(()=>{this.success=false},3000)
      })
      .catch(error =>{
        alert(error)
      })
      .finally(() => {this.processing = false})
    },
    annotate(annotation){
      this.$emit('annotation',annotation)
    }
  },
  computed: {
    image_src() {
      return `${process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL}/images/${this.$route.params.collection}/${this.item.image}`
    },
    annotation(){
      return this.item.annotation
    }

  },
  watch: {
    annotation() {
      this.update_item()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.collection_item {
  margin: 1em;
  padding: 1em;
}
.collection_item:not(:last-child) {
  border-bottom: 1px solid #dddddd;
}

img {
  width: 15vw;
  transition: 0.25s;
  cursor: zoom-in;
}

img.zoomed {
  cursor: zoom-out;
  width: 90%;
}

.controls_wrapper {
  margin: 1em;
  font-size: 120%;
}
</style>
