<template>
  <div class="home">

    <h1>{{$route.params.collection}}</h1>

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
        <div class="items_container">
          <transition-group name="flip-list" tag="div">

              <CollectionItem
                v-for="doc in sorted_items"
                :key="doc._id"
                :item="doc"
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
import XLSX from 'xlsx'
import CollectionItem from '@/components/CollectionItem.vue'

export default {
  name: 'List',
  components: {
    Loader,
    CollectionItem
  },
  data(){
    return {
      collection: [],
      api_url: process.env.VUE_APP_TOKUSHIMA_STORAGE_API_URL
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

    export_collection(){
      var workbook = XLSX.utils.book_new()
      var ws1 = XLSX.utils.json_to_sheet(this.collection)
      XLSX.utils.book_append_sheet(workbook, ws1, "Sheet1")
      XLSX.writeFile(workbook, 'export.xlsx')
    },
    drop_collection(){
      if(!confirm('ホンマに？')) return
      this.axios.delete(`${this.api_url}/collections/${this.$route.params.collection}`)
      .then(() => {
        this.$router.push({name: 'home'})
      })
      .catch(error =>{
        alert(error)
      })
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
    }
  }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}

.items_container {

}

.items_container > div {

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>
