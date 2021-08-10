import Koa = require('koa')
import bodyParser = require('koa-bodyparser')

import { PORT } from '../configs'
import './controllers'
import './helpers/zk.client'

const app: Koa = new Koa()

app.use(bodyParser())
app.listen(PORT)

console.log(`应用启动成功 端口:${PORT}`)
