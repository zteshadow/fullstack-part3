
require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

//
app.use(express.static('static-page'))

const cors = require('cors')
app.use(cors())

// middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    // must used after express.json(), body will be undefined otherwise
    console.log('Body:', request.body)
    console.log('--')
    next()
}

app.use(express.json())
app.use(requestLogger)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

// Notes
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then(note =>{
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save()
    .then(savedNote => {
        console.log(note)
        response.json(note)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
        response.json(updatedNote)
    })
    .catch(error => next(error))
})

// Phonebook
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let message = `Phonebook has info for ${persons.length} people<br/>${Date()}`
    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id)
    let person = persons.find(item => item.id === id)
    console.log(person)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    let id = Number(request.params.id)
    let person = persons.find(person => person.id === id)

    console.log(person)
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.json(person)
    } else {
        response.status(204).end()
    }
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json( {error: error.message} )
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001 // moving to Render
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})
