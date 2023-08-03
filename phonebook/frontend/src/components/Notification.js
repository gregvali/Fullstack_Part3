const Notification = ({ message }) => {
    if (message === null)
      return null
    if (message.includes(`Error`))
      return <div className ='errorMessage'> {message} </div>
    else
      return <div className ='message'> {message} </div>
  }

  export default Notification