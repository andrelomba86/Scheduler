import Datastore from '@seald-io/nedb'
import express from 'express'

const port = process.env.PORT || 5000
var app = express()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})
// Configura body parse do express
app.use(express.json()) // for parsing application/json

// Configura NeDB
var db = new Datastore({ filename: 'agenda.db', autoload: true })

// Helper function to parse dates
function dateparse(date) {
  return new Date(Date.parse(date))
}

app.post('/update', (req, res) => {
  console.log('POST /update')
  try {
    var id = req.body.id
    var values = req.body.values
    if (id) {
      db.update({ _id: id }, { $set: values }, {}, (err, numReplaced) => {
        if (err) res.json({ result: false, error: err })
        else res.json({ result: true, numReplaced: numReplaced })
      })
    } else throw Error('ERROR: ID para exclusão não informado')
  } catch (err) {
    res.json({ result: false, error: err })
  }
})

app.post('/del', (req, res) => {
  console.log('POST /del')
  try {
    var id = req.body.id
    if (id) {
      db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) res.json({ result: false, error: err })
        else res.json({ result: true, numRemoved: numRemoved })
      })
    } else throw Error('ERROR: ID para exclusão não informado')
  } catch (err) {
    res.json({ result: false, error: err })
  }
})

app.post('/add', (req, res) => {
  console.log('POST /add')
  try {
    console.log(req.body)
    var name = req.body.name
    if (name) {
      db.insert({ name: name, test: 'kxklkas', n: 1 }, (err, newDoc) => {
        if (err) res.json({ result: false, error: err, newDoc })
        else res.json({ result: true, doc: newDoc })
      })
    } else throw Error('ERROR: No name given')
  } catch (err) {
    res.json({ result: false, error: err })
  }
})

app.get('/get', (req, res) => {
  console.log('get /GET')
  db.find({}, (err, docs) => {
    if (err) {
      res.json({ error: err })
      return
    }
    res.json({ collection: docs })
  })
})

app.listen(port, () => console.log(`Express - Listening on port ${port}`))
