export interface IChannelInfo {
    id: string
    title: string
    imageSrc: string
    audioSrc: string
}

const getChannelsApiUrl = (): string => {
    const base = import.meta.env.VITE_RESTDB_BASE_URL
    const collection = import.meta.env.VITE_RESTDB_COLLECTION
    if (!base) throw new Error('VITE_RESTDB_BASE_URL is required')
    if (!collection) throw new Error('VITE_RESTDB_COLLECTION is required')
    return `${base}/${collection}`
}

const fetchChannels = async (): Promise<IChannelInfo[]> => {
    const apiKey = import.meta.env.VITE_RESTDB_API_KEY
    if (!apiKey) throw new Error('VITE_RESTDB_API_KEY is required')
    const response = await (
        await fetch(getChannelsApiUrl(), {
            headers: {
                'x-apikey': apiKey,
            },
        })
    ).json()
    return response as IChannelInfo[]
}

const areEqual = (
    id1: string | number | null,
    id2: string | number | null
): boolean => {
    if (!id1 || !id2) {
        return false
    }
    return id1.toString() === id2.toString()
}

const resizeToMinimum = (): void => {
    const minimum: [number, number] = [500, 640]
    const current: [number, number] = [window.outerWidth, window.outerHeight]
    const restricted: [number, number] = current

    for (let index = 0; index < restricted.length; index++) {
        restricted[index] =
            minimum[index] > current[index] ? minimum[index] : current[index]
    }

    window.resizeTo(restricted[0], restricted[1])
}

export { fetchChannels, areEqual, resizeToMinimum }
