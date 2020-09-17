<template>
  <div class="collection">




    <div
      class="error"
      v-if="collection.error">
      Error loading collection
    </div>

    <div
      class="loader_container"
      v-else-if="collection.loading">
      <Loader />
    </div>

    <template v-else>

      <template v-if="collection.length > 0">
        <div class="toolbar">

          <div class="">
            <LabelIcon />
            <span>{{annotated_items.length}}/{{collection.length}}</span>
          </div>



          <div class="size_adjustment_controls">

            <ImageSizeSelectLargeIcon/>
            <input type="range" min="15" max="80" v-model="image_size">
          </div>
        </div>

        <div class="items_container">
          <transition-group name="flip-list" tag="div">

              <CollectionItem
                v-for="doc in sorted_items"
                :key="doc._id"
                :item="doc"
                :size="image_size"
                @annotation="update_item($event, doc)"/>


          </transition-group>
        </div>

      </template>


      <div class="" v-else>
        Collection is empty
      </div>
    </template>





  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@moreillon/vue_loader'
import CollectionItem from '@/components/CollectionItem.vue'

import ImageSizeSelectLargeIcon from 'vue-material-design-icons/ImageSizeSelectLarge.vue';
import LabelIcon from 'vue-material-design-icons/Label.vue';

export default {
  name: 'List',
  components: {
    Loader,
    CollectionItem,
    ImageSizeSelectLargeIcon,
    LabelIcon,
  },
  data(){
    return {
      collection: [],
      image_size: "20",
      api_url: process.env.VUE_APP_STORAGE_SERVICVE_API_URL
    }
  },
  mounted(){
    this.get_list()
  },
  beforeRouteUpdate (to, from, next) {
    this.get_list(to.query.collection)
    next()
  },

  methods: {

    get_list(){
      this.$set(this.collection,'loading',true)
      this.axios.get(`${this.api_url}/collections/${this.$route.params.collection}`)
      .then(response => {
        this.collection = []
        response.data.forEach((doc) => {
          this.collection.push(doc)
        });
      })
      .catch(error =>{
        this.$set(this.collection,'error',true)
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
      .finally(()=>{this.$set(this.collection,'loading',false)})
    },



  },
  computed: {
    sorted_items(){
      return this.collection.slice().sort((a, b) => {
        if(a.annotation && !b.annotation) return 1
        else if(b.annotation && !a.annotation) return -1
        else if(a.annotation < b.annotation) return -1
        else if(a.annotation > b.annotation) return 1
        else return 0
      })
    },
    annotated_items(){
      return this.collection.filter(item => {
        return !!item.annotation
      })
    }
  }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.75s;
}

.items_container {

}

.items_container > div {

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.toolbar {
  margin: 0.5em 0;
  display: flex;
  align-items: center;
  font-size: 150%;
}

.toolbar > * {
  margin-right: 1em;
  display: flex;
  align-items: center;
}

.toolbar > div > *:not(:last-child) {
  margin-right: 0.25em;
}

.size_adjustment_controls {



}



.size_adjustment_controls > label {
  margin-right: 0.5em;
}


</style>
