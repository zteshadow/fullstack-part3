
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

// it's the firewall that blocks the connection, wow
// const url = `mongodb+srv://samuelsongbc:${password}@fullstack.agjuzd5.mongodb.net/noteApp?retryWrites=true&w=majority`
const url = process.env.MONGODB_URI
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch(error => {
    console.log(`error connecting to MongoDB: ${error.message}`)
})

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

module.exports = mongoose.model('Note', noteSchema)

// Retrieve all notes
/*
Note.find({ important: true }).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
*/

// Create a new note
/*
const note = new Note({
    content: 'We are now connected to samuel12!',
    important: true,
})

console.log('start saving')
note.save()
    .then(result => {
        console.log(`note saved: ${result}`)
        mongoose.connection.close()
    })
    .catch(error => {
        console.log(`error catched: ${error}`)
        mongoose.connection.close()
    })
console.log('end saving')
*/
