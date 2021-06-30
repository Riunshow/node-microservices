const axios = require('axios')
const TOKEN  = 'XNxzJkzUHPy-R81r-WJT'
// const TOKEN  = 'BDgycbqLekgsEnwe8VyZ'

const baseURL = 'http://gd-gitlab.dc.servyou-it.com/api/v4'

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
