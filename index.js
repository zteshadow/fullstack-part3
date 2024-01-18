
const express = require('express')
const app = express()

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

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })

    console.log(note)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

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

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes = notes.concat(note)
    console.log(note)
    response.json(note)
})


// const unknowEndpoint = (request, response, next) => {
//     response.status(404).send({error: 'unknow error'})
// }
// app.use(unknowEndpoint)

const PORT = process.env.PORT || 3001 // moving to Render
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})
