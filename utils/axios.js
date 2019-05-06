import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://project-tuna.com',
})

export default instance
