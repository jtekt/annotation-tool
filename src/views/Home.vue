<template>
  <v-card>
    <v-carousel
      v-if="images.length"
      v-model="carrousel_index"
      height="auto"
      hide-delimiters>
      
      <v-carousel-item

        v-for="(image, index) in images"
        :key="image._id">

        <v-card>
          <v-card-text>
            <v-img
              height="400px"
              contain
              :src="image_src(image)"
              alt=""/>
          </v-card-text>

          <v-card-text>
            <v-row justify="center">
              <v-col
                v-for="label in labels"
                :key="`item_${image._id}_${label}`"
                cols="auto">
                <v-btn
                  :color="button_color(image, label)"
                  @click="annotate_item(image, label, index)">
                  {{label}}
                </v-btn>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>

      </v-carousel-item>

    </v-carousel>
  </v-card>
</template>

<script>

  export default {
    name: 'Home',
    data(){
      return {
        carrousel_index: 0,
        images: [],
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
        .then( ({data}) => { this.images = data })
        .catch( (error) => {
          console.error(error)
        })
        .finally( () => {
          this.loading = false
        })
      },
      annotate_item(item, annotation, index){
        const url = `${process.env.VUE_APP_IMAGE_STORAGE_API_URL}/images/${item._id}`
        this.axios.patch(url, {annotation})
        .then( ({data}) => {
          // DIRTY
          this.$set(this.images,index,data)
          this.carrousel_index ++
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
      labels(){
        const {VUE_APP_LABELS} = process.env
        if(!VUE_APP_LABELS) return ['OK','NG']
        return VUE_APP_LABELS.split(',')
      }
    }

  }
</script>
