
import React from 'react'
import ListItem from './ListItem'

const ListOfPersons = ({persons, filtered, deletePerson}) => {
    return(
      persons
        .filter(person => 
          person.name.toLowerCase().includes(filtered.toLowerCase())
        )
        .map(person => 
          <ListItem 
            key={person.id} 
            person = {person}
            deletePerson={deletePerson}
          />
        )
    )
  }

  export default ListOfPersons