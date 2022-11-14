<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto">
          Items
        </v-col>
        <v-spacer />
        <!-- TODO: FIX -->
        <!-- <v-col cols="auto">
          <v-btn :to="{name: 'annotate', params: {_id: 'random'}}">
            First unannotated item
          </v-btn>
        </v-col> -->
      </v-row>
    </v-toolbar>
    <v-divider />


    <v-card-text>


      <v-data-table :loading="loading" :headers="headers" :items="items" :server-items-length="total"
        :options.sync="tableOptions" @click:row="$router.push({name: 'annotate', params: {_id: $event._id}})">


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

      }

    },
    mounted(){
      this.get_images()
    },
    watch: {
      query: {
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
        const params = this.query

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
      query() {
        return this.$route.query
      },
      tableOptions: {
        get() {

          const {
            limit = 10,
            sort = 'time',
            order = 1,
            skip = 0,
          } = this.$route.query

          return {
            itemsPerPage: Number(limit),
            sortBy: [sort],
            sortDesc: [order === '-1'],
            page: (skip / limit) + 1
          }
        },
        set(newVal) {

          const { itemsPerPage, page, sortBy, sortDesc } = newVal
          const params = {
            limit: String(itemsPerPage),
            skip: String((page - 1) * itemsPerPage),
            order: String(sortDesc[0] ? -1 : 1),
            sort: sortBy[0],
          }
          const query = { ...this.$route.query, ...params }

          // Preventing route duplicates
          if (JSON.stringify(this.$route.query) !== JSON.stringify(query)) this.$router.push({ query })
        }
      },
    }

  }
</script>
