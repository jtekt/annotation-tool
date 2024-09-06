<template>
  <v-card class="mx-auto" max-width="30em">
    <v-card flat>
      <v-card-title> Settings </v-card-title>
    </v-card>
    <v-card-text>
      <LabelsEdit />
    </v-card-text>
  </v-card>
</template>

<script>
import LabelsEdit from "../components/LabelsEdit.vue"
export default {
  name: "Settings",
  components: {
    LabelsEdit,
  },
}
</script>
