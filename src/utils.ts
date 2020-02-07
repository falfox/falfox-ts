export const splitLyric = (lyrics: string): string[] => {
    const lyricChunks = []
    const splitted = lyrics.split("\n")
    let currChunk = ""

    for (const i in splitted) {
        const line = splitted[i]
        if (currChunk.length + line.length < 2000) {
            currChunk += `${line}\n`
        } else {
            lyricChunks.push(currChunk)
            currChunk = ""
            currChunk += `${line}\n`
        }

        if (parseInt(i) == splitted.length - 1) {
            lyricChunks.push(currChunk)
        }
    }

    return lyricChunks
}