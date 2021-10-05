const Koa = require("koa")
const app = new Koa()
const cors = require("@koa/cors")

const { router } = require("./router")

app.use(cors())

app.use(router.routes()).use(router.allowedMethods())

module.exports = {
  app,
}
