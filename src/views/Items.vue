<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto">
          Items
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn 
            :to="{name: 'annotate', params: {_id: 'random'}}">
            First unannotated item
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />


    <v-card-text>
      
      
      <v-data-table
          :loading="loading"
          :headers="headers"
          :items="items"
          @click:row="$router.push({name: 'annotate', params: {_id: $event._id}})">


          <!-- Thumbnails -->
          <template v-slot:item.image="{ item }">
            <v-img
              contain
              max-height="100"
              max-width="100"
              :src="image_src(item)"
              alt="item"/>
          </template>

        </v-data-table>
      </v-card-text>
  </v-card>
</template>

<script>

  export default {
    name: 'items',
    data(){
      return {
        loading: false,
        items: [],
        headers: [
          {text: 'Image', value: "image"},
          {text: 'Time', value: "time"},
          {text: 'Annotation', value: 'data.annotation'}
        ],
      }

    },
    mounted(){
      this.get_images()
    },
    methods: {
      image_src({_id}){
        return `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${_id}/image`
      },
      get_images(){
        this.loading = true
        const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images`
        this.axios.get(url)
        .then( ({data}) => { this.items = data })
        .catch( (error) => {
          console.error(error)
        })
        .finally( () => {
          this.loading = false
        })
      },

      
    },
    computed: {

    }

  }
</script>
