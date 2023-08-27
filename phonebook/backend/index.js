require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('build'))

morgan.token('object', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :object`));

app.get('/', (request, response) => {
  response.send('<h1>Welcome to the phonebook!</h1>')
})

app.get('/info', (request, response) => {
  requestTime = new Date();
  Person.countDocuments({}).then(persons => {
    response.send(`
      <div>
      Phonebook has info for ${persons.length} people <br/>
      ${requestTime}
      </div>
    `)
  })
})
  
app.get('/api/phonebook', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/phonebook/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/phonebook/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

app.put('/api/phonebook/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})