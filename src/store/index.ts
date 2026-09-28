import { defineStore } from 'pinia'

const defaultLabels = ['OK', 'NG']

export const useAppStore = defineStore('app', {
    state: () => ({
        labels: null as string[] | null,
    }),
    actions: {
        loadLabels() {
            const preventEdit = import.meta.env.VITE_PREVENT_LABELS_EDIT
            const envLabels = import.meta.env.VITE_LABELS

            if (preventEdit) {
                this.labels = envLabels ? envLabels.split(',') : defaultLabels
            } else {
                const saved = localStorage.getItem('labels')
                if (saved) {
                    try {
                        this.labels = JSON.parse(saved)
                    } catch {
                        this.labels = defaultLabels
                    }
                } else if (envLabels) {
                    this.labels = envLabels.split(',')
                } else {
                    this.labels = defaultLabels
                }
            }
        },
        saveLabels(labels: string[]) {
            this.labels = labels
            localStorage.setItem('labels', JSON.stringify(labels))
        },
    },
})
