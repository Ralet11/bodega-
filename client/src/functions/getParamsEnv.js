export const getParamsEnv = () => {
    const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

    return {
        API_URL_BASE
    }
}
