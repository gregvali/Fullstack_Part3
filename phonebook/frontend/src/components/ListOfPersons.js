import ListItem from './ListItem'

const ListOfPersons = ({persons, filter, deletePerson}) => {
    return(
      persons
        .filter(person => 
          person.name.toLowerCase().includes(filter.toLowerCase())
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