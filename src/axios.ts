import axios from 'axios'
import runtimeEnv from './runtimeEnv'

axios.defaults.baseURL = runtimeEnv.VITE_IMAGE_STORAGE_API_URL

export default axios
