const PersonForm = ({addPerson, newName, handleNameChange, newNum, handleNumChange}) => {
    return(
      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
           number: <input
            value = {newNum}
            onChange={handleNumChange}
          />
        </div>
        <button type="submit">add</button>
      </form> 
    )
  }

  export default PersonForm