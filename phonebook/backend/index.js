require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('object', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :object`));

let numbers = [
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
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/phonebook/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/phonebook/:id', (request, response) => {
  const id = Number(request.params.id)
  numbers = numbers.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/phonebook', (request, response) => {
  const body = request.body
  console.log(body)
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: `name or number missing`
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})