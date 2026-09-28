import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_IMAGE_STORAGE_API_URL

export default axios
