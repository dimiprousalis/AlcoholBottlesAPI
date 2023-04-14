const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 3000
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'bottles'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })



app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})


//Return entire DB
app.get('/api', (request, response) => {
    //go to the database and find the collection and put all objects into an array
    db.collection('spirits').find().toArray()
        .then(data => {
            response.json(data)
        })
        .catch(error => console.error(error))
})

//Search for specific bottle type
app.get('/api/:name', (request, response) => {
    const bottleType = request.params.name.toUpperCase()
    let query = { Type: bottleType }
    db.collection('spirits').find(query).toArray()
        .then(data => {
            response.json(data)
        })
        .catch(error => console.error(error))
})

//adding process.env.PORT allows use on hosting port
app.listen(process.env.PORT || PORT, () => {
    console.log(`The server is now running on ${PORT}! Better go catch it!`)
})



