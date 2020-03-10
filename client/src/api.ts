/**
 * Save the api uri to make requests.
 */
import axios from 'axios'

// environment variables captured when building by parcel using dotenv
const apiUri = process.env['API']

export const api = axios.create({ baseURL: apiUri, withCredentials: true })
