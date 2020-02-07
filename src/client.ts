import { Client } from "@line/bot-sdk"

export const config = {
    channelAccessToken: process.env['CHANNEL_ACCESS_TOKEN']!,
    channelSecret: process.env['CHANNEL_SECRET']!
}

if (!config.channelAccessToken || !config.channelSecret) {
    console.error("$channelAccessToken and $channelSecret is not found")
    process.exit()
}

export const client = new Client(config)