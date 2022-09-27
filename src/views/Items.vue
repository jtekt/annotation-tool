<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto">
          Items
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn :to="{name: 'annotate', params: {_id: 'random'}}">
            First unannotated item
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />


    <v-card-text>


      <v-data-table :loading="loading" :headers="headers" :items="items" :server-items-length="total"
        :options.sync="options" @click:row="$router.push({name: 'annotate', params: {_id: $event._id}})">


        <!-- Thumbnails -->
        <template v-slot:item.image="{ item }">
          <v-img contain max-height="100" max-width="100" :src="image_src(item)" alt="item" />
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
        total: 0,
        options: {
          sortBy: ['time'],
          sortDesc: [true],
        },
      }

    },
    mounted(){
      this.get_images()
    },
    watch: {
      options: {
        handler() {
          this.get_images()
        },
        deep: true,
      },
    },
    methods: {
      image_src({_id}){
        return `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${_id}/image`
      },
      get_images(){
        this.loading = true
        this.items = []
        const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images`
        const { itemsPerPage, page, sortBy, sortDesc } = this.options
        const params = {
          limit: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
          sort: sortBy[0],
          order: sortDesc[0] ? -1 : 1,
        }
        this.axios.get(url, { params })
          .then(({ data }) => {
            this.items = data.items
            this.total = data.total
          })
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
