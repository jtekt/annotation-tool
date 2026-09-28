/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IMAGE_STORAGE_API_URL: string
    readonly VITE_LABELS: string
    readonly VITE_PREVENT_LABELS_EDIT: string
    readonly VITE_CATEGORIZER: string
    readonly VITE_I18N_LOCALE: string
    readonly VITE_I18N_FALLBACK_LOCALE: string
    readonly VITE_IDENTIFICATION_URL: string
    readonly VITE_LOGIN_URL: string
    readonly VITE_OIDC_AUTHORITY: string
    readonly VITE_OIDC_CLIENT_ID: string
    readonly VITE_OIDC_AUDIENCE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
