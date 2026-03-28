const express = require('express')
const app = express()
const cors = require('cors')



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

const requestLogger = (request, respone, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(express.static('dist'))
app.use(cors({
  origin: 'https://libreta-o8vo.onrender.com'
}))
app.use(requestLogger)

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`)
  next()
})

app.get('/', (request, response) => {
  response.send('<h1>Hello Juansito!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

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

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
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
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  console.log(request.headers)
  console.log(request.body)
  notes = notes.concat(note)

  response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body

  const note = notes.find(n => n.id === id)
  if (!note) {
    return response.status(404).json({ error: 'note not found' })
  }

  const updatedNote = { ...note, content: body.content, important: body.important }
  notes = notes.map(n => n.id !== id ? n : updatedNote)

  response.json(updatedNote)
})

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknow endpoint' })
}

app.use(unknowEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})