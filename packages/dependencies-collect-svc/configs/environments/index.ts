import * as dotenv from 'dotenv'

dotenv.config()

export const {
  identity,
  port,
  host,
  rootPath,
  serviceName,
  zkHost
} = process.env
