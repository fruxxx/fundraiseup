const Router = require("koa-router")
const koaBody = require("koa-body")

const { donate } = require("./controllers/donation")

const router = new Router()

router.get("/", (ctx, next) => {
  ctx.body = { ok: true }
})

router.post("/donate", koaBody(), async (ctx, next) => {
  const { amount, currency } = ctx.request.body

  const donationResult = await donate({
    amount,
    currency,
  })

  if (donationResult.error) {
    ctx.body = { ok: false, error: donationResult.error.description }
    return
  }

  ctx.body = { ok: true }
})

module.exports = {
  router,
}
