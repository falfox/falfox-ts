import { WebhookEvent, MessageEvent, Message, TextEventMessage } from "@line/bot-sdk"
import * as fs from 'fs-extra'

import { client } from './client'
import { getInstagram, getAzlyric, searchAzlyric } from './modules'
import { instagramFlex, } from './templates/instagram'
import { lyricSearchFlex } from './templates/lyric'
import { splitLyric } from './utils'

const commands = {
    test: /^tes(t)?/i,
    bye: /^bye/i,
    help: /^(falfox|help)/i,

    insta: /^(insta|ig) (.+)/i,
    instaHelp: /^(insta|ig)/i,

    lyrics: /^(lyrics) (.+)/i,
    lyricsHelp: /^(lyrics)/i,

    lyric: /^(lyric) (.+)/i,
    lyricHelp: /^(lyric)/i,
}

export const handleEvent = async (event: WebhookEvent) => {
    // if (event.source.userId !== 'U29b9243b94f06951a52179b0aed5e34a') {
    //     return
    // }
    switch (event.type) {
        case 'message':
            const message = event.message
            switch (message.type) {
                case 'text':
                    const reply = await handleText(event)

                    if (reply) {
                        return client.replyMessage(event.replyToken, reply)
                    }
                // return handleText(message, event.replyToken, event.source)
                case 'image':
                // return handleImage(message, event.replyToken)
                case 'video':
                // return handleVideo(message, event.replyToken)
                case 'audio':
                // return handleAudio(message, event.replyToken)
                case 'location':
                // return handleLocation(message, event.replyToken)
                case 'sticker':
                // return handleSticker(message, event.replyToken)
                default:
                // throw new Error(`Unknown message: ${JSON.stringify(message)}`)
            }

        case 'follow':
        // return replyText(event.replyToken, 'Got followed event')

        case 'unfollow':
        // return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`)

        case 'join':
        // return replyText(event.replyToken, `Joined ${event.source.type}`)

        case 'leave':
            return console.log(`Left: ${JSON.stringify(event)}`)

        case 'postback':
            let data = JSON.parse(event.postback.data)

            const reply = await handlePostback(data)

            if (reply) {
                return client.replyMessage(event.replyToken, reply)
            }

        default:
            throw new Error(`Unknown event: ${JSON.stringify(event)}`)
    }
}

const handleText = async (event: MessageEvent): Promise<Message | Message[] | null> => {
    const message = event.message as TextEventMessage
    const text = message.text
    let m


    if ((m = text.match(commands.help))) {
        const menu = await fs.readFile('menu.txt', 'utf-8')
        return {
            type: 'text',
            text: menu
        }
    }

    if ((m = text.match(commands.bye))) {
        if (event.source.type == "group") {
            client.replyMessage(event.replyToken, {
                type: "sticker",
                packageId: '11538',
                stickerId: '51626533'
            })
            client.leaveGroup(event.source.groupId)
        } else if (event.source.type == "room") {
            client.replyMessage(event.replyToken, {
                type: "sticker",
                packageId: '11538',
                stickerId: '51626533'
            })
            client.leaveGroup(event.source.roomId)
        } else {
            return {
                type: "text",
                text: "FalFox tidak bisa keluar dari personal chat"
            }
        }
    }

    if ((m = text.match(commands.test))) {
        return {
            type: "text",
            text: "in"
        }
    }

    if ((m = text.match(commands.insta))) {
        const user: any = await getInstagram(m[2])

        if (!user) return {
            type: "text",
            text: `Username ${m[2]} tidak ditemukan`
        }

        return {
            type: "flex",
            altText: `@${user.username} instagram info`,
            contents: instagramFlex(user)
        }
    }

    if ((m = text.match(commands.instaHelp))) {
        console.log(m)
        return {
            type: "text",
            text: "Ketik \"insta (username)\" untuk mencari akun instagram"
        }
    }

    if ((m = text.match(commands.lyrics))) {
        const songs = await searchAzlyric(m[2])

        if (songs.length < 1) {
            return {
                type: "text",
                text: "Lirik tidak ditemukan"
            }
        }

        return {
            type: "flex",
            altText: `Lyric search results for ${m[2]}`,
            contents: lyricSearchFlex(songs)
        }
    }

    if ((m = text.match(commands.lyricsHelp))) {
        return {
            type: "text",
            text: "Ketik \"lyrics (judul lagu)\" untuk mencari lagu"
        }
    }

    if ((m = text.match(commands.lyric))) {
        const songs = await searchAzlyric(m[2])

        if (songs.length < 1) {
            return {
                type: "text",
                text: "Lirik tidak ditemukan"
            }
        }

        const [song] = songs

        const { lyrics } = await getAzlyric(song.url)

        return splitLyric(lyrics).map((lyric) => ({
            type: "text",
            text: lyric
        }))
    }

    if ((m = text.match(commands.lyricHelp))) {
        return {
            type: "text",
            text: "Ketik \"lyric (judul lagu)\" untuk mencari lirik"
        }
    }

    return null
}

interface PostbackData {
    type: string,
    url?: string
}

enum PostbackDataType {
    SeeLyric = "see_lyric",
}

const handlePostback = async (data: PostbackData): Promise<Message | Message[] | null> => {
    switch (data.type) {
        case PostbackDataType.SeeLyric:
            const { lyrics } = await getAzlyric(data.url as string)
            return splitLyric(lyrics).map((lyric) => ({
                type: "text",
                text: lyric
            }))
        default:
            return null
    }
}