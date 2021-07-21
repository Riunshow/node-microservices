import Koa = require('koa')
import bodyParser = require('koa-bodyparser')

import { port } from '../configs'
import './controllers'
import 'app/helpers/zk.client'

const app: Koa = new Koa()

app.use(bodyParser())
app.listen(port)

console.log(`应用启动成功 端口:${port}`)
