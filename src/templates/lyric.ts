import { FlexContainer } from "@line/bot-sdk";
import { SongResult } from '../modules'

export const lyricSearchFlex = (songs: SongResult[]): FlexContainer => ({
    type: "carousel",
    contents: songs.map(({ artist, title, url }) => ({
        type: "bubble",
        styles: {
            footer: {
                separator: true,
            }
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    color: "#FD750A",
                    weight: "bold",
                    size: "sm",
                    text: "SONG"
                },
                {
                    type: "text",
                    weight: "bold",
                    size: "xl",
                    margin: "md",
                    wrap: true,
                    text: title
                },
                {
                    type: "text",
                    margin: "sm",
                    wrap: true,
                    text: artist
                },
            ]
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    style: "link",
                    height: "sm",
                    color: "#FD750A",
                    action: {
                        type: "postback",
                        label: "See Lyric",
                        data: JSON.stringify({
                            type: "see_lyric",
                            url: url
                        }),
                        text: `See Lyric ${artist} - ${title}`
                    }
                }
            ]
        }
    }))

})

