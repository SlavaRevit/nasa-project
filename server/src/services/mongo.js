require('dotenv').config()
const mongoose = require('mongoose')

const MONGO_URL = process.env.mongoDB_URL

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready')
})

mongoose.connection.on('error', err => {
	console.error(err)
})

async function connect() {
	await mongoose.connect(MONGO_URL)
}

async function disconnect() {
	await mongoose.disconnect()
}

module.exports = {
	connect,
	disconnect,
}
