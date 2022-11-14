<template>
  <v-card
    :loading="loading">

    <v-toolbar flat>
      <v-row align="baseline" justify="space-between">
        <v-col cols="auto">
          <v-btn icon @click="get_previous_item_by_date()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>

        <v-col v-if="item" cols="auto">
          {{item.file}}
        </v-col>

    
        <v-col cols="auto">
          <v-btn icon @click="get_next_item_by_date()">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />
    

    <template v-if="item">


      <v-card-text>

        <v-row>
          <v-col cols="10">
            <v-img contain :src="image_src" alt="" />
          </v-col>
          <v-col>
            <v-radio-group v-model="item.data.annotation" @change="save_annotation()">
              <v-radio label="No annotation" :value="null" />
              <v-radio v-for="(label, index) in labels" :key="`label_${index}`" :label="label" :value="label" />
            </v-radio-group>
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
    document.addEventListener("keydown", this.handle_keydown)
    if(this.document_id === 'random') this.get_next_unannotated_item()
    else this.get_item_by_id()
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handle_keydown)
  },
  watch: {
    document_id () {
      if(this.document_id === 'random') this.get_next_unannotated_item()
      else this.get_item_by_id()
    }
  },
  methods: {
    
    get_item_by_id(){
      this.loading = true
      const url = `${this.api_url}/images/${this.document_id}`
      this.axios.get(url)
        .then(({data}) => {
          this.item = data
          if(!this.item.data.annotation) this.$set(this.item.data,'annotation',null)
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

        if (!total) {
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

      // TODO: FIX BECAUSE CURRENTLY NOT WORKING

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
        to: this.item.time,
        sort: 'time',
        order: -1,
        limit: 1,
      }

      this.get_items_with_options({params})
    },
    get_previous_item_by_date(){

      const params = {
        from: this.item.time,
        sort: 'time',
        order: 1,
        limit: 1,
      }

      this.get_items_with_options({params})
    },



    save_annotation(){
      const url = `${this.api_url}/images/${this.item._id}`
      const {annotation} = this.item.data
      this.axios.patch(url, {annotation})
      .then( ({data}) => {
        this.item = data
        this.get_next_item_by_date()
        //setTimeout(this.get_next_item_by_date, 500)
      })
      .catch( (error) => {
        console.error(error)
      })
      .finally( () => {
        this.loading = false
      })
    },

    annotate(newAnnotation){
      this.item.data.annotation = newAnnotation
      this.save_annotation()
    },
    handle_keydown(e) {
      // Keyboard events

      // Left arrow key: previous item
      if (e.keyCode === 37) {
        e.preventDefault()
        this.get_previous_item_by_date()
      }
      // Right arrow key: next item
      if (e.keyCode === 39) {
        e.preventDefault()
        this.get_next_item_by_date()
      }

      if (e.key === '0'){
        e.preventDefault()
        this.annotate(null)
      }

      this.labels.forEach( (label, index) => {
        if (e.key === String(index + 1)) {
          e.preventDefault()
          this.annotate(label)
          console.log(label)
        }
      })

    },

  },
  computed: {
    document_id(){
      return this.$route.params._id
    },
    image_src() {
      return `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${this.document_id}/image`
    },
    labels(){
      const {VUE_APP_LABELS} = process.env
      if(!VUE_APP_LABELS) return ['OK','NG']
      return VUE_APP_LABELS.split(',')
    }
  }

}
</script>
