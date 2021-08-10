import * as dotenv from 'dotenv'

dotenv.config()

export const {
  identity,
  PORT,
  HOST,
  SERVICE_NAME: serviceName,
  ZK_ROOT_PATH: zkRootPath,
  ZK_HOST
} = process.env
