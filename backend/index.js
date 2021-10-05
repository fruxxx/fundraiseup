const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname + "./../.env") })
console.log(process.env.MONGO_URL)
const server = require("./server")
const mongo = require("./mongo")

// START SERVER
mongo
  .connect()
  .then(() => {
    console.info(
      `💾 Mongo ready at ${process.env.MONGO_URL.replace(/:\/\/.*?@/, "://")}`
    )
  })
  .then(() => server.app.listen(process.env.HTTP_PORT))
  .then((url) => {
    console.info(
      `⚙️  Server run in ${process.env.NODE_ENV}, port: ${process.env.HTTP_PORT}`
    )
  })
  .catch((err) => {
    console.error(`🛑 Error init server ${err.stack || err}`)
    mongo.close().then(() => {
      process.exit(1)
    })
  })

// safe stop
process.on("SIGINT", () => {
  mongo.close().then(() => {
    process.exit(1)
  })
})
