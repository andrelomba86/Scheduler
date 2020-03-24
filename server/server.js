import './MongoDB.js'
import express from 'express'
import createNewMongoDB from './MongoDB.js';

const port = process.env.PORT || 5000;
var app = express()

// Configura body parse do express
app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//Configura mongoDB
var mongoDB = createNewMongoDB()
mongoDB.Connect(
  'participantes',
  {
    name: String,
    dates: Array
  },
  'Kittens'
)

// mongoDB.Add({
//   name: 'Cesar',
//   dates: [
//     {
//     start: dateparse("01/20/2020"),
//     end: dateparse("02/08/2020"),
//     daysOfWeekAndPeriod: []
//     }
//   ]
// },(x) => null)
// mongoDB.Add({
//   name: 'Marcus',
//   dates: [
//     {
//       start: dateparse("07/13/2020"),
//       end: dateparse("07/27/2020"),
//       daysOfWeekAndPeriod: [
//         { day: 2, period: 1 },
//         { day: 2, period: 1 }
//       ]
//     },

//     {
//       start: dateparse("03/01/2020"),
//       end: dateparse("07/14/2020"),
//       daysOfWeekAndPeriod: [
//         { day: 5, period: 0}
//       ]
//     }
//   ]
// }, (x) => null)
// mongoDB.Add({ name: 'Cesar', dates: [ [dateparse("01/20/2020"), dateparse("02/06/2020")], [dateparse("07/13/2020"), dateparse("07/27/2020")], ['Quarta', 0], ['Quarta', 1] ] }, () => {})
// mongoDB.Add({ name: 'Fabio', dates: [ [dateparse("01/15/2020"), dateparse("02/12/2020")], [dateparse("07/13/2020"), dateparse("07/27/2020")], ['Quinta', 1] ] }, () => {})
// mongoDB.Add({ name: 'Lucas', dates: [ ['Segunda', 0], ['Quarta', 1] ] }, () => {})
function dateparse(date) { return new Date(Date.parse(date)); }

app.post('/update', (req, res) => {
  try {
    var id = req.body.id
    var values = req.body.values
    if (id) {
         mongoDB.Update(id, values, (err) => {
          if (err)  res.json({ result: false, error: err }) 
          else res.json({ result: true })
        })
    }
    else throw Error("ERROR: ID para exclusão não informado")
  }
  catch (err) {
    console.log("------------------- 3 ---------------------------")
    res.json({ result: false, error: err })
  }
})

app.post('/del', (req, res) => {
  try {
    var id = req.body.id
    if (id) {
      mongoDB.Remove(id, (result, err) => {
        if (result) res.json({ result: true })
        else res.json({ result: false, error: err })
      })
    }
    else throw Error("ERROR: ID para exclusão não informado")
  }
  catch (err) {
    res.json({ result: false, error: err })
  }
})

app.post('/add', (req, res) => {
  try {
    var name = req.body.name
    if (name) {
      mongoDB.Add({ name: name }, (result, doc, err) => {
        if (result) res.json({ result: true, doc: doc })
        else res.json({ result: false, error: err })
      })
    }
    else throw Error("ERROR: No name given")
  }
  catch (err) {
    res.json({ result: false, error: err })
  }
})

app.get('/get', (req, res) => {

  // res.json({ doc: "kkk" })
  mongoDB.SelectAll((docs, err) => {
    if (!docs) {
      console.log("ERRO:", err)
      res.json({ error: err })
      return
    }
    res.json({ collection: docs })
    // res.json({ collection: docs });
    // res.render('home', { doc: docs })
  })

});

app.listen(port, () => console.log(`Express - Listening on port ${port}`));