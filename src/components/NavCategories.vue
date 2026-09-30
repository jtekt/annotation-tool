<template>
    <v-list-group v-if="fieldName" prepend-icon="mdi-folder-multiple-image">
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="fieldName" />
        </template>

        <v-list-item
            v-for="(fieldValue, i) in fieldValues"
            :key="i"
            prepend-icon="mdi-image-multiple"
            :title="String(fieldValue)"
            :to="{
                name: 'items',
                query: {
                    [fieldName]: fieldValue,
                    limit: 10,
                    skip: 0,
                    order: -1,
                    sort: 'time',
                },
            }"
            exact
        />
    </v-list-group>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import runtimeEnv from '@/runtimeEnv'

const fieldName = runtimeEnv.VITE_CATEGORIZER || ''
const fieldValues = ref<string[]>([])

onMounted(async () => {
    if (!fieldName) return
    const { data } = await axios.get(`/fields/${fieldName}`)
    fieldValues.value = data
})
</script>
