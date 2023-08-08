
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/phonebook'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const erase = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
    .then(response => response.data)
}

export default { getAll, create, update, erase }