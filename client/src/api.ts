/**
 * Save the api uri to make requests.
 */
import * as axios from 'axios'

// environment variables captured when building by parcel using dotenv
const apiUrl = process.env['API']

export const api = axios.default.create({ baseURL: apiUrl, withCredentials: true })
