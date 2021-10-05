const mongoose = require("mongoose")
const klaw = require("klaw-sync")
const path = require("path")

function models() {
  return klaw(path.join(__dirname, "models"), {
    nodir: true,
  })
    .filter((file) => path.extname(file.path) === ".js")
    .map((file) => {
      const fileName = path.parse(file.path).name
      delete mongoose.connection.models[fileName]
      delete require.cache[require.resolve(file.path)]

      const mongoModel = require(file.path)

      return mongoose.model(fileName, mongoModel)
    })
}

async function connect() {
  if (process.env.MONGO_URL == null) {
    process.env.MONGO_PORT =
      process.env.MONGO_PORT != null ? process.env.MONGO_PORT : 27017
    process.env.MONGO_URL =
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOSTNAME}` +
      `:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin&retryWrites=true`
  }

  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 20000,
  })

  models()

  return mongoose
}

async function close() {
  await Promise.all(
    mongoose.connections.map((connection) => connection.close())
  )
  if (mongoose.server != null) {
    await mongoose.server.stop()
  }
}

module.exports = {
  connect,
  close,
  db: mongoose.models,
}
