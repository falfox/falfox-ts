import axios from 'axios'
import * as cheerio from 'cheerio'


export const getInstagram = async (username: string) => {
    const response = await axios.get(`https://www.instagram.com/${username}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
        },
        responseType: 'text',
        validateStatus: status => status < 500 // Reject only if the status code is greater than or equal to 500
    })

    if (response.status != 404) {
        const html = response.data;
        const data = html.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)
        const gdata = JSON.parse(data).entry_data.ProfilePage[0].graphql

        if (gdata.hasOwnProperty('user')) {
            return gdata.user
        } else {
            throw new Error("Failed to fetch user data")
        }
    } else {
        return null
    }
}

export interface SongResult {
    title: string;
    url: string;
    artist: string;
}

export interface LyricResult extends SongResult {
    lyrics: string;
}

export const searchAzlyric = async (keyword: string): Promise<SongResult[]> => {
    const userAgents = [
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
        'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
        'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:11.0) Gecko/20100101 Firefox/11.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    ]

    const response = await axios.get(`https://search.azlyrics.com/search.php?q=${keyword}`, {
        headers: {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
        },
        responseType: 'text'
    })

    if (response.status != 404) {
        const html = response.data;
        const $ = cheerio.load(html)

        let selectedPanel;
        const panels = $('.panel')
        console.log(panels.length)
        if (panels.length <= 0) {
            return []
        } else {
            for (const panel of panels.toArray()) {
                if (RegExp(/song results/i).test($(panel).text())) {
                    selectedPanel = panel
                }
            }
            const songResults = $(selectedPanel).find('.table.table-condensed tr td.visitedlyr').slice(0, 10)

            const results: SongResult[] = []
            songResults.map((i, song) => {
                results.push({
                    title: ($(song).find('a').text()),
                    artist: $(song).find('b:nth-child(2)').text(),
                    url: $(song).find('a').first().attr('href') || ""
                })
            })

            return results
        }
    } else {
        return []
    }
}

export const getAzlyric = async (url: string): Promise<LyricResult> => {
    const userAgents = [
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
        'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
        'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:11.0) Gecko/20100101 Firefox/11.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    ]

    const response = await axios.get(url, {
        headers: {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
        },
        responseType: 'text'
    })

    if (response.status != 404) {
        const html = response.data;
        const $ = cheerio.load(html)

        const body = $('.col-xs-12.col-lg-8.text-center')
        const elements = $(body).find('b')
        const artist = $(elements[0]).text().replace(" Lyrics", "")
        const title = $(elements[1]).text().replace(/^"|"$/g, '')

        const divs = $(body).find('div:not([class])')
        let lyrics = $(divs[0]).text().trim()
        lyrics = `${artist} - ${title}\n${lyrics}`

        return {
            artist,
            title,
            url,
            lyrics,
        }
    } else {
        throw new Error("Lyrics not found")
    }
};