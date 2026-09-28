<template>
  <v-card>
    <template #title>Images</template>

    <v-card-text>
      <v-container fluid>
        <QuerySettings :fields="fields" />
      </v-container>

      <v-data-table-server
        :loading="loading"
        :headers="headers"
        :items="items"
        :items-length="total"
        :items-per-page="tableItemsPerPage"
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 50, title: '50' },
          { value: 100, title: '100' },
        ]"
        item-value="_id"
        @update:options="handleOptionsUpdate"
        @click:row="handleRowClick"
      >
        <template v-slot:item.image="{ item }">
          <v-img
            contain
            height="100"
            width="100"
            :src="imageSrc(item)"
            alt="item"
          />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import QuerySettings from "@/components/QuerySettings.vue";
import axios from "@/axios";

interface Item {
  _id: string;
  file: string;
  time: string;
  data: Record<string, unknown>;
}

interface DataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: Array<{ key: string; order: "asc" | "desc" }>;
}

const displayedFieldsEnv = import.meta.env.VITE_DISPLAYED_FIELDS;
const storageApiUrl = import.meta.env.VITE_IMAGE_STORAGE_API_URL;

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const items = ref<Item[]>([]);
const fields = ref<string[]>([]);
const total = ref(0);

const tableItemsPerPage = computed(() => Number(route.query.limit) || 10);

const headers = computed(() => [
  { title: "Image", key: "image", sortable: false },
  { title: "Time", key: "time" },
  { title: "Annotation", key: "data.annotation", sortable: false },
]);

const query = computed(() => route.query as Record<string, string>);

watch(query, () => getItems(), { deep: true, immediate: true });

onMounted(() => {
  if (!displayedFieldsEnv) getFields();
  if (!route.query.limit) {
    router.replace({
      query: { ...route.query, limit: "10", skip: "0" },
    });
  }
});

function imageSrc(item: Item) {
  return `${storageApiUrl}/images/${item._id}/image`;
}

function getItems() {
  loading.value = true;
  axios
    .get("/images", { params: query.value })
    .then(({ data }) => {
      items.value = data.items;
      total.value = data.total;
    })
    .catch(console.error)
    .finally(() => {
      loading.value = false;
    });
}

function getFields() {
  axios
    .get("/fields")
    .then(({ data }) => {
      fields.value = data;
    })
    .catch(console.error);
}

function handleOptionsUpdate(options: DataTableOptions) {
  const { page, sortBy } = options;
  const limit = tableItemsPerPage.value;
  const sort = sortBy[0]?.key ?? "time";
  const order = sortBy[0]?.order === "desc" ? "-1" : "1";
  const newQuery = {
    ...route.query,
    limit: String(limit),
    skip: String((page - 1) * limit),
    sort,
    order,
  };
  if (JSON.stringify(route.query) !== JSON.stringify(newQuery))
    router.replace({ query: newQuery });
}

function handleRowClick(
  _event: MouseEvent,
  row: { item: Item; index: number },
) {
  const {
    skip = 0,
    limit = 50,
    sort = "time",
    order = 1,
    ...rest
  } = query.value;
  const cursor = Number(skip) + Number(row.index);
  router.push({
    name: "annotate",
    params: { _id: row.item._id },
    query: { ...rest, skip, limit, sort, order, cursor },
  });
}
</script>
