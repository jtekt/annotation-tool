<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto"> Items </v-col>
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
      <v-row>
        <v-col cols="12">
          <QuerySettings :fields="fields" />
        </v-col>
      </v-row>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="items"
        :server-items-length="total"
        :options.sync="tableOptions"
        @click:row="
          $router.push({ name: 'annotate', params: { _id: $event._id } })
        "
      >
        <!-- Thumbnails -->
        <template v-slot:item.image="{ item }">
          <v-img
            contain
            max-height="100"
            max-width="100"
            :src="image_src(item)"
            alt="item"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import QuerySettings from "../components/QuerySettings.vue"

const { VUE_APP_DISPLAYED_FIELDS } = process.env

export default {
  name: "items",
  components: {
    QuerySettings,
  },
  data() {
    return {
      loading: false,
      items: [],
      fields: [],
      headers: [
        { text: "Image", value: "image" },
        { text: "Time", value: "time" },
        { text: "Annotation", value: "data.annotation" },
      ],
      total: 0,
    }
  },
  mounted() {
    this.get_items_and_fields()
  },
  watch: {
    query: {
      handler() {
        this.get_items()
      },
      deep: true,
    },
  },
  methods: {
    image_src({ _id }) {
      return `/images/${_id}/image`
    },
    get_items_and_fields() {
      this.get_items()
      if (!VUE_APP_DISPLAYED_FIELDS) this.get_fields()
    },
    get_fields() {
      this.axios
        .get("/fields")
        .then(({ data }) => {
          this.fields = data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    get_items() {
      this.loading = true
      this.items = []
      const url = `/images`
      const params = this.query

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.items = data.items
          this.total = data.total
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
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
          sort = "time",
          order = 1,
          skip = 0,
        } = this.$route.query

        return {
          itemsPerPage: Number(limit),
          sortBy: [sort],
          sortDesc: [order === "-1"],
          page: skip / limit + 1,
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
        if (JSON.stringify(this.$route.query) !== JSON.stringify(query))
          this.$router.push({ query })
      },
    },
  },
}
</script>
