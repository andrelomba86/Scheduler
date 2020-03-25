import mongoose from 'mongoose'
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)

function createNewMongoDB() {
    //var mongoose = require('mongoose');
    var _schema = null
    //const _db = mongoose.connection;
    var _model = null


    function Connect(database, schema, modelname, callback) {
        _schema = new mongoose.Schema(
            schema,
            {
                toObject: {
                    virtuals: true,
                },
                toJSON: {
                    virtuals: true,
                },
            }
        )
        _model = mongoose.model(modelname, schema)
        mongoose
            .connect('mongodb://mongo:27017/' + database, { useNewUrlParser: true })
            .then(() => {
                //callback(true, null)                 
                /// ??????????????????????? errro callback not a function
            }).catch((err) => {
                //callback(false, err)                
            });
    }

    async function Add(data, callback) {
        var _modeldata = new _model(data);

        _modeldata.save((err, doc) => {
            if (err) {
                console.log("MongoDB.Add() - erro:", err)
                callback(false, null, err)
            }
            else {
                console.log("MongoDB.Add() - OK:", doc)
                callback(true, doc)
            }
        })

        console.log(_modeldata.name); // 'Silence'
    }

    async function Update(id, data, callback) {
        _model.findByIdAndUpdate(id, data, { new: false }, (err, doc) => {
            
            callback(err,doc)
        })
        //     // console.log("MongoDB.Update() - OK:", doc)
        //     // callback(true, doc)
        // }).catch((err) => {
        //     // console.log("MongoDB.Update() - erro:", err)
        //     // callback(false, err)
        // })
    }

    function Remove(id, callback) {
        _model.findByIdAndRemove(id)
            .then((doc) => {
                console.log("MongoDB.Remove() - OK:", doc)
                callback(true)
            })
            .catch((err) => {
                console.log("MongoDB.Remove() - erro:", err)
                callback(false, err)
            });
    }

    function SelectAll(callback) {
        return _model.find().lean().exec((err, doc) => {
            callback(doc, err)
        })
    }
    return {
        Connect,
        Add,
        Update,
        Remove,
        SelectAll
    }
}
export default createNewMongoDB
//module.exports = createNewMongoDB;