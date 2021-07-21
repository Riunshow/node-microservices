const axios = require('axios')

const TOKEN = ''

const baseURL = ''

const service = axios.create({
  baseURL,
  timeout: 99999
})

service.interceptors.request.use(
  config => {
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': TOKEN
    }
    return config
  },
  error => {
    return error
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return error
  }
)

module.exports = service
