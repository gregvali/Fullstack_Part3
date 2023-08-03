
const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('object', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :object`));

let numbers = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Welcome to the phonebook!</h1>')
})

app.get('/info', (request, response) => {
  requestTime = new Date();
  response.send(`
    <div>
    Phonebook has info for ${numbers.length} people <br/>
    ${requestTime}
    </div>
  `)
})
  
app.get('/api/phonebook', (request, response) => {
    response.json(numbers)
})

app.get('/api/phonebook/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = numbers.find(person => person.id === id)
    
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/phonebook/:id', (request, response) => {
  const id = Number(request.params.id)
  numbers = numbers.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/phonebook', (request, response) => {
  const body = request.body

  const found = () => {
    return numbers
      .map(p => p = p.name.toLowerCase())
      .find(n => n === body.name.toLowerCase())
  }
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: `name or number missing`
    })
  }

  if(found()){
    return response.status(400).json({ 
      error: `name must be unique`
    })
  }

  const person = {
    id: Math.floor(Math.random()*1000),
    name: body.name,
    number: body.number,
  }

  numbers = numbers.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})