<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="auto">
                <h1>404 — Page not found</h1>
                <v-btn :to="{ name: 'items' }" color="primary" class="mt-4">
                    Go to Images
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
