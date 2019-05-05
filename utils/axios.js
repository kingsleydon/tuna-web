import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://34.80.227.208:8000',
  // baseURL: 'http://localhost:8000',
})

export default instance
