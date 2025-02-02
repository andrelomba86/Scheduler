import Datastore from 'nedb'

function createNewNeDB() {
  var db = new Datastore()

  function Connect(database, schema, modelname, callback) {
    db = new Datastore({ filename: database + '.db', autoload: true })
    if (callback) callback(true, null)
  }

  async function Add(data, callback) {
    db.insert(data, (err, newDoc) => {
      if (err) {
        console.log('NeDB.Add() - erro:', err)
        callback(false, null, err)
      } else {
        console.log('NeDB.Add() - OK:', newDoc)
        callback(true, newDoc)
      }
    })
  }

  async function Update(id, data, callback) {
    db.update({ _id: id }, { $set: data }, {}, (err, numReplaced) => {
      callback(err, numReplaced)
    })
  }

  function Remove(id, callback) {
    db.remove({ _id: id }, {}, (err, numRemoved) => {
      if (err) {
        console.log('NeDB.Remove() - erro:', err)
        callback(false, err)
      } else {
        console.log('NeDB.Remove() - OK:', numRemoved)
        callback(true)
      }
    })
  }

  function SelectAll(callback) {
    db.find({}, (err, docs) => {
      callback(docs, err)
    })
  }

  return {
    Connect,
    Add,
    Update,
    Remove,
    SelectAll,
  }
}

export default createNewNeDB
