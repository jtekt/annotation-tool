<template>
  <v-card
    :loading="loading">
    
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-btn 
            icon
            @click="get_previous_item_by_date()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-spacer />
 
        <v-col cols="auto">
          <v-btn 
            icon
            @click="get_next_item_by_date()">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider/>

    <template v-if="item">
      <v-card-text>

        <v-img
          height="400px"
          contain
          :src="image_src(item)"
          alt=""/>
        
      </v-card-text>


      <v-card-text>

        <v-row justify="center">
          <v-col
            v-for="(label, index) in labels"
            :key="`label_${index}`"
            cols="auto">
            <v-btn
              :color="button_color(item, label)"
              @click="annotate_item(label)">
              {{label}}
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn 
              @click="annotate_item(null)">
              <v-icon>mdi-tag-off</v-icon>
            </v-btn>
          </v-col>

        </v-row>
      </v-card-text>
    </template>


    <v-snackbar v-model="snackbar.show">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar.show">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-card>
</template>

<script>

export default {
  name: 'Home',
  data(){
    return {
      loading: false,
      item: null,
      api_url: process.env.VUE_APP_IMAGE_STORAGE_API_URL,

      snackbar: {
        show: false,
        text: '',
      },

    }

  },
  mounted(){
    if(this.document_id === 'random') this.get_next_unannotated_item()
    else this.get_item_by_id()
  },
  watch: {
    document_id () {
      if(this.document_id === 'random') this.get_next_unannotated_item()
      else this.get_item_by_id()
    }
  },
  methods: {
    image_src({_id}){
      return `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${_id}/image`
    },
    get_item_by_id(){
      this.loading = true
      const url = `${this.api_url}/images/${this.document_id}`
      this.axios.get(url)
        .then(({data}) => {
          this.item = data
        })
        .catch(error =>{
          this.error = true
          if(error.response) console.log(error.response.data)
          else console.log(error)
        })
        .finally(() => { this.loading = false })
    },
    get_items_with_options(options){
      // This function simply navigates to the next item
      // The item itself is obtained with get_item_by_id
      

      if(this.loading) return
      this.loading = true
      const url = `${this.api_url}/images`

      this.axios.get(url,options)
      .then(({data: {items, total}}) => {

        if (total === 0) {
          this.snackbar.show = true
          this.snackbar.text = 'No more items'
          return
        }
        

        const { _id } = items[0]

        // Prevent reloading current route
        if(this.document_id !== _id) {
          this.$router.push({name: 'annotate', params: { _id }})
        }

      })
      .catch(error =>{
        this.error = true
        if(error.response) console.log(error.response.data)
        else console.log(error)
      })
      .finally(() => this.loading = false)
    },
    get_next_unannotated_item(){

      const params = {
        filter: { 
          $or: [
            { "data.annotation": {$not: {$exists: true}} },
            { "data.annotation": null },
          ]
        } ,
        limit: 1,
      }

      this.get_items_with_options({params})
    },
    get_next_item_by_date(){

      const params = {
        filter: {time: {'$lt' : this.item.time}},
        limit: 1,
      }

      this.get_items_with_options({params})
    },
    get_previous_item_by_date(){

      const params = {
        filter: {time: {'$gt' : this.item.time}},
        sort: {time: 1},
        limit: 1,
      }

      this.get_items_with_options({params})
    },
    delete_annotation(){
      this.$set(this.item, 'annotation', null)
    },
    annotate_item(annotation){
      const url = `${this.api_url}/images/${this.item._id}`
      this.axios.patch(url, {annotation})
      .then( () => {
        this.get_next_item_by_date()
      })
      .catch( (error) => {
        console.error(error)
      })
      .finally( () => {
        this.loading = false
      })
    },
    button_color(item, label){
      if(!item.data || !item.data.annotation) return
      if(item.data.annotation === label) return 'green'
    }
  },
  computed: {
    document_id(){
      return this.$route.params._id
    },
    labels(){
      const {VUE_APP_LABELS} = process.env
      if(!VUE_APP_LABELS) return ['OK','NG']
      return VUE_APP_LABELS.split(',')
    }
  }

}
</script>
