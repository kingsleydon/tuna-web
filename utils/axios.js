import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.project-tuna.com',
})

export default instance
