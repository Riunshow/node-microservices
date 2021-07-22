import * as dotenv from 'dotenv'

dotenv.config()

export const {
  identity,
  port,
  host,
  zkRootPath,
  zkHost
} = process.env
