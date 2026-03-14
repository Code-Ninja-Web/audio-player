import axios, { AxiosError } from 'axios'
import { IChannelInfo } from '../scrapper'

const getDbUrl = (): string => {
    const url = process.env['RESTDB_BASE_URL']
    if (!url) throw new Error('RESTDB_BASE_URL is required')
    return url
}
const getCollectionName = (): string => {
    const name = process.env['RESTDB_COLLECTION']
    if (!name) throw new Error('RESTDB_COLLECTION is required')
    return name
}
const getApiKey = (): string => {
    const key = process.env['FULL_ACCESS_RESTDB_API_KEY']
    if (!key) throw new Error('FULL_ACCESS_RESTDB_API_KEY is required')
    return key
}
const resetChannelsList = async (): Promise<void> => {
    const dbUrl = getDbUrl()
    const collection = getCollectionName()
    try {
        await axios.delete(`${dbUrl}/${collection}/*?q={}`, {
            headers: {
                'x-apikey': getApiKey(),
            },
        })
    } catch (error) {
        console.log((error as AxiosError).message)
        throw error as Error
    }
}

const addChannels = async (channels: IChannelInfo[]): Promise<void> => {
    const dbUrl = getDbUrl()
    const collection = getCollectionName()
    try {
        await axios.post(`${dbUrl}/${collection}`, channels, {
            headers: {
                'x-apikey': getApiKey(),
            },
        })
    } catch (error) {
        console.log((error as AxiosError).message)
        throw error as Error
    }
}

export { resetChannelsList, addChannels }
