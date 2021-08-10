import * as dotenv from 'dotenv'

dotenv.config()

export const {
  identity,
  PORT,
  HOST,
  ZK_ROOT_PATH: zkRootPath,
  SERVICE_NAME: serviceName,
  ZK_HOST
} = process.env
