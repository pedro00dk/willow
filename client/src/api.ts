/**
 * Save the api url to make requests.
 */
import axios from 'axios'

// environment variables captured when building by parcel using dotenv
const apiUrl = process.env['API']

export const api = axios.create({ baseURL: apiUrl, withCredentials: true })
