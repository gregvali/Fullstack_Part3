import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import ListOfPersons from './components/ListOfPersons'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'

const App = () => {
  //set states
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('Hello there!')

  //set display to all objects on server
  useEffect(() => { 
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
    }, [])

  //add person
  const addPerson = (event) => {
    const foundPerson = persons.filter(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )
    const personObject = {
      name: newName,
      number: newNum,
    }
    event.preventDefault()

    //input name already exists
    const selectedPersonName = newName;

    if (foundPerson.length !== 0) {
      if(window.confirm(`${selectedPersonName} is already added to phonebook, replace the old number with the new one?`)) {
        personService
          .update(foundPerson[0].id, personObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== foundPerson[0].id ? person : response.data))
            setMessage(`Updated the phone number of ${selectedPersonName}`)
          })
          .catch(error => {
            setMessage(`Error: ${selectedPersonName} was already deleted`)
            setPersons(persons.filter(person => person.id !== foundPerson[0].id))
          })
      }
      else
        console.log(`cancel was pressed`)
    }
    //new input
    else
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setMessage(`Created a list item for ${selectedPersonName}`)
        })
      setNewName('')
      setNewNum('')  
  }

  //delete person
  const deletePerson = (id) => {
    const selectedPerson = persons.filter(p => p.id === id)
    const personName = selectedPerson[0].name
    const personId = selectedPerson[0].id
    if (window.confirm(`Delete ${personName} ?`)) {
      personService
        .erase(personId)
        .catch(error => {
          setMessage(`Error: Person with id ${personId} was already deleted`)
          setPersons(persons.filter(person => person.id !== personId))

        })
      setPersons(persons.filter(person => person.id !== personId))
    }
  }

  //event handlers
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter 
        filter = {filter} 
        handle={handleFilterChange}
      />
      
      <h3>add a new</h3>
      <PersonForm 
        addPerson = {addPerson} 
        newName = {newName} 
        newNum = {newNum}
        handleNameChange = {handleNameChange}
        handleNumChange = {handleNumChange}
      />

      <h3>Numbers</h3>
      <ListOfPersons 
        persons = {persons} 
        filtered = {filter}
        deletePerson = {deletePerson}
      />
    </div>
  )
}

export default App
