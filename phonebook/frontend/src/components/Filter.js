const Filter = ({filter, handle}) => {
    return (
      <form>
        <div>
          filter shown with <input
            value = {filter}
            onChange={handle}
          />
        </div>
      </form> 
    )
  }

export default Filter