import axios, { AxiosResponse } from 'axios'

export interface IChannelInfo {
    id: string
    title: string
    imageSrc: string
    audioSrc: string
}

interface IChannelItemValue {
    name: string
    image: string
    live_url: string
}

const getLastScriptTag = (htmlStr: string): string => {
    const regex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi
    let match
    let lastScript = ''
    while ((match = regex.exec(htmlStr)) !== null) {
        if (match[1] && match[1].indexOf('var channels') > -1) {
            lastScript = match[1]
        }
    }
    return lastScript
}

/** Extract the single top-level object after "var channels = " using brace matching */
const extractChannelsObjectString = (scriptStr: string): string => {
    const marker = 'var channels'
    const idx = scriptStr.indexOf(marker)
    if (idx === -1) return ''
    const afterMarker = scriptStr.slice(idx + marker.length)
    const assignIdx = afterMarker.search(/\s*=\s*/)
    if (assignIdx === -1) return ''
    const start = afterMarker.indexOf('{', assignIdx)
    if (start === -1) return ''
    let depth = 1
    let i = start + 1
    while (i < afterMarker.length && depth > 0) {
        const c = afterMarker[i]
        if (c === '{') depth++
        else if (c === '}') depth--
        i++
    }
    return depth === 0 ? afterMarker.slice(start, i) : ''
}

/**
 * Parse a JS object literal string (e.g. from "var channels = { ... };") into a plain object.
 * Uses Function so all key/value formats and trailing commas work. Source is the known ingest page.
 */
const parseObjectLiteral = (objectString: string): Record<string, unknown> => {
    try {
        return new Function(`return (${objectString})`)() as Record<
            string,
            unknown
        >
    } catch {
        return {}
    }
}

/** Parse the full channels object from script (id -> { name, image, live_url }) */
const parseChannelsObject = (
    scriptStr: string
): Record<string, IChannelItemValue> => {
    const objectStr = extractChannelsObjectString(scriptStr)
    if (!objectStr) return {}
    const parsed = parseObjectLiteral(objectStr) as Record<
        string,
        IChannelItemValue
    >
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
}

// Source base URL from env (required). INGEST_SOURCE_PAGE_PATH defaults to radio/live.php.
const getSourceBase = (): string => {
    const base = process.env['INGEST_SOURCE_BASE_URL']
    if (!base) throw new Error('INGEST_SOURCE_BASE_URL is required')
    return base.replace(/\/$/, '')
}
/** Ingest page that contains the channels object (e.g. radio/live.php) */
const getIngestPageUrl = (): string => {
    const base = getSourceBase()
    const path = process.env['INGEST_SOURCE_PAGE_PATH'] || 'radio/live.php'
    return `${base}/${path.replace(/^\//, '')}`
}

const fetchChannelsFromIngestPage = async (
    url: string
): Promise<IChannelInfo[]> => {
    const { data } = await axios.get<unknown, AxiosResponse<string>>(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ingest/1.0)' },
        maxContentLength: Infinity,
    })
    const scriptStr = getLastScriptTag(data)
    const channels = parseChannelsObject(scriptStr)
    return Object.entries(channels)
        .filter(
            ([_, v]) =>
                v &&
                typeof v.name === 'string' &&
                typeof v.live_url === 'string'
        )
        .map(([id, value]) => ({
            id,
            title: value.name,
            imageSrc: value.image || '',
            audioSrc: value.live_url,
        }))
}

const fetchChannels = async (): Promise<IChannelInfo[]> => {
    try {
        const list = await fetchChannelsFromIngestPage(getIngestPageUrl())
        if (list.length > 0) {
            console.log(`${list.length} channels found`)
            return list
        }
    } catch (err) {
        console.error(`Ingest failed: ${(err as Error).message}`)
    }
    console.log('No channels found')
    return []
}

export { fetchChannels }
