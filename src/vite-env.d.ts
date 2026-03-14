/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_RESTDB_BASE_URL: string
    readonly VITE_RESTDB_COLLECTION: string
    readonly VITE_RESTDB_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
