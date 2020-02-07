import { FlexContainer } from "@line/bot-sdk";

export const instagramFlex = (user: any): FlexContainer => ({
    "type": "bubble",
    "body": {
        "type": "box",
        "layout": "horizontal",
        "margin": "none",
        "contents": [{
            "type": "image",
            "url": user.profile_pic_url,
            "aspectMode": "cover",
            "align": "start",
            "size": "xl"
        },
        {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [{
                "type": "box",
                "layout": "vertical",
                "contents": [{
                    "type": "text",
                    "text": user.edge_owner_to_timeline_media.count.toString(),
                    "weight": "bold",
                    "align": "end"
                },
                {
                    "type": "text",
                    "text": "posts",
                    "size": "sm",
                    "align": "end"
                }
                ]
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents": [{
                    "type": "text",
                    "text": user.edge_followed_by.count.toString(),
                    "weight": "bold",
                    "align": "end"
                },
                {
                    "type": "text",
                    "text": "followers",
                    "size": "sm",
                    "align": "end"
                }
                ]
            },
            {
                "type": "box",
                "layout": "vertical",
                "contents": [{
                    "type": "text",
                    "text": user.edge_follow.count.toString(),
                    "weight": "bold",
                    "align": "end"
                },
                {
                    "type": "text",
                    "text": "following",
                    "size": "sm",
                    "align": "end"
                }
                ]
            }
            ]
        }
        ]
    },
    "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [{
            "type": "separator"

        },
        {
            "type": "text",
            "text": (user.is_private ? "(Private) " : " ") + user.full_name + (user.is_verified ? " ✓" : " "),
            "weight": "bold",
            "margin": "md"
        },
        {
            "type": "text",
            "text": user.biography ? user.biography : " ",
            "size": "sm",
            "wrap": true
        },
        {
            "type": "text",
            "text": user.external_url ? user.external_url : " ",
            "size": "sm"
        },
        {
            "type": "button",
            "action": {
                "type": "uri",
                "label": "Follow @" + user.username,
                "uri": "https://www.instagram.com/" + user.username
            },
            "style": "primary",
            "color": "#3897f0",
            "height": "sm",
            "margin": "md"
        }
        ]
    }

})