<template>
  <div
    class="collection_item">

    <img
      :style="{width: `${size}vw`}"
      :class="{zoomed: zoomed}"
      :src="image_src"
      @click="zoomed = !zoomed">

    <div class="current_annotation">
      {{item.annotation || 'Not annotated'}}
    </div>



    <div class="controls_wrapper">

      <button
        type="button"
        v-for="label in labels"
        v-bind:key="label"
        :disabled="processing"
        @click="item.annotation = label">
        {{label}}
      </button>

      <button
        type="button"
        @click="item.annotation = undefined"
        :disabled="processing">
        None
      </button>


    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectionItem',
  props: {
    item: Object,
    size: String,
  },
  data() {
    return {
      zoomed: false,
      processing: false,
      labels: ['OK', 'NG'],
    }
  },
  mounted(){
    this.parse_labels_from_env()
  },
  methods: {
    parse_labels_from_env(){
      if(!process.env.VUE_APP_LABELS) return

      try {
        this.labels=JSON.parse(process.env.VUE_APP_LABELS)
      }
      catch (e) {
        console.error(e)
        return
      }
    },
    update_item(){
      this.processing = true
      let api_url = process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL
      let collection = this.$route.params.collection
      let entry_id = this.item._id
      let url = `${api_url}/collections/${collection}/${entry_id}`

      this.axios.put(url, this.item)
      .then( () => {
        // Nothing
      })
      .catch(error =>{
        alert(error)
      })
      .finally(() => {this.processing = false})
    },


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

  background-color: white;
  margin: 1em;

  font-size: 150%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);



}

.collection_item.zoomed {
  width: 90%;
}

.collection_item > * {
}


img {
  cursor: zoom-in;
  transition: 0.25s;
  margin: 1em;
}

img.zoomed {
  width: 80vw !important;
  cursor: zoom-out;
}


.controls_wrapper {
  width: 100%;
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.current_annotation {
  margin: 0 1em;
}

.controls_wrapper button {
  padding: 0.5em;
  margin: 0.5em 1em ;
}




</style>
