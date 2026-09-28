<template>
    <v-text-field
        :model-value="displayDate"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        clearable
        @click="menu = true"
        @click:clear="emit('update:modelValue', undefined)"
    />

    <v-dialog v-model="menu" max-width="290px">
        <v-date-picker
            :model-value="pickerDate"
            @update:model-value="onDateSelected"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
    label?: string
    modelValue?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string | undefined]
}>()

const menu = ref(false)

const pickerDate = computed(() => {
    if (!props.modelValue) return undefined
    return new Date(props.modelValue)
})

const displayDate = computed(() => {
    if (!props.modelValue) return null
    const date = new Date(props.modelValue)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
})

function onDateSelected(value: unknown) {
    menu.value = false
    if (!value) return
    const date = value instanceof Date ? value : new Date(value as string)
    emit('update:modelValue', date.toISOString())
}
</script>
