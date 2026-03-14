import { addChannels, resetChannelsList } from './restdb'
import { fetchChannels } from './scrapper'
import * as dotenv from 'dotenv'

// Load .env.local first (so it wins), then .env. Use .env.local for secrets when running ingest locally.
dotenv.config({ path: '.env.local' });
dotenv.config();
// update channels data
// prettier-ignore
(async () => {
    const channels = await fetchChannels()
    if (channels.length) {
        try {
            await resetChannelsList()
        } catch (error) {
            console.error(
                `reset channel data failed: ${(error as Error).message}`
            )
        }

        try {
            await addChannels(channels)
        } catch (error) {
            console.error(`adding channels failed: ${(error as Error).message}`)
        }
    }
})()
