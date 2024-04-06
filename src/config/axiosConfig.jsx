import axios from 'axios'

export default () => {
    axios.defaults.headers['Content-Type'] = 'application/json'
}