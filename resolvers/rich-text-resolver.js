import { createRichTextHtmlResolver } from '@kontent-ai/delivery-sdk';
import { nodeParser } from '@kontent-ai/delivery-node-parser';

export const resolveRichText = (element, linkedItems) => createRichTextHtmlResolver(nodeParser).resolveRichText({
    element,
    linkedItems,
    urlResolver: (linkId, linkText, link) => {
        switch (link.type) {
            case "article":
                return {
                    linkUrl: `/articles/${link.linkId}`
                }
            case "coffee":
                return {
                    linkUrl: `/articles/${link.linkId}`
                }
            case "brewer":
                return {
                    linkUrl: `/articles/${link.linkId}`
                }
            default:
                return { linkUrl: ""}
        }
    },
    contentItemResolver: (itemId, contentItem) => {
        if (contentItem && contentItem.system.type === 'hosted_video') {
            if (contentItem.elements.videoHost.value[0].codename === "vimeo") {
                return {
                    contentItemHtml: `<iframe class="hosted-video__wrapper"
                    src="https://player.vimeo.com/video/${contentItem.elements.videoId.value}?title =0&byline =0&portrait =0"
                    width="640"
                    height="360"
                    frameborder="0"
                    webkitallowfullscreen
                    mozallowfullscreen
                    allowfullscreen
                    >
                    </iframe>`
                };
            }
            else if (contentItem.elements.videoHost.value[0].codename === "youtube") {      
                return {
                    contentItemHtml: `<iframe class="hosted-video__wrapper"
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/${contentItem.elements.videoId.value}"
                    frameborder="0"
                    allowfullscreen
                    >
                    </iframe>`
                }
            }       
            return {
                contentItemHtml: ''
            };
        }

        else if ((contentItem && contentItem.system.type === 'tweet')) {
            console.log("tweet")
            return {
                contentItemHtml: `<div><blockquote class="twitter-tweet" data-theme="${contentItem.elements.theme.value[0].codename}" ${contentItem.elements.displayOptions.value.some(e => e.codename === "hide_thread") ? "data-conversation=hidden" : ''} ${contentItem.elements.displayOptions.value.some(e => e.codename === "hide_media") ? "data-conversation=none" : ''}><a href="${contentItem.elements.tweetLink.value}"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>`
            }
        }

        return {
            contentItemHtml: ''
        };
    }
});

