const { MongoClient } = require("mongodb")
require('dotenv').config()

let database
const uri = `mongodb+srv://ceckardt254:${process.env.DATABASE_PASSWORD}@cluster0.sen83.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const connectToDatabase = async () => {
  if (!database) {
    try {
      await client.connect()
      database = client.db('drawings')
    } catch (error) {
      console.error(error)
    }
  }
}

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  return await fn(req, res)
}

const getDrawings = async (req, res) => {
  if (req.method === 'GET') {
    try {
      await connectToDatabase()
      const drawings = await database.collection('drawings')
        .find()
        .toArray()
      res.status(200).json(drawings)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch drawings' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

const postDrawing = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await connectToDatabase()
      const newDrawing = req.body
      await database.collection('drawings').insertOne(newDrawing)
      res.status(201).json({ message: 'Drawing added successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to add drawing' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

module.exports = {
  getHighscores: allowCors(getDrawings),
  postHighscore: allowCors(postDrawing)
}
