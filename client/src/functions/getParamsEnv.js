export const getParamsEnv = () => {
    const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:80"

    return {
        API_URL_BASE
    }
}