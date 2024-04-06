import axios from 'axios'

const search = (title) => {
    return new Promise((resolve, reject) => {
        axios.post('https://www.youtube.com/youtubei/v1/search?prettyPrint=false', {
            "context": {
                "client": {
                    "hl": "vi",
                    "gl": "VN",
                    "clientName": "WEB",
                    "clientVersion": "2.20240322.01.00"
                }
            },
            "query": title
        })
            .then(res => {
                resolve(res.data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents)
            })
            .catch(err => reject(err))
    })
}

const getHint = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://suggestqueries-clients6.youtube.com/complete/search`, {
            params: {
                client: 'youtube',
                hl: 'vi',
                gl: 'vn',
                ds: 'yt',
                gs_ri: 'youtube',
                q: query,
                xhr: 't',
                cp: 9
            }
        })
            .then(res => {
                resolve(res.data[1])
            })
            .catch(err => reject(err))
    })
}

const getVideo = (videoId) => {
    return new Promise((resolve, reject) => {
        axios.post(`https://www.youtube.com/youtubei/v1/player`, {
            'context': {
                'client': {
                    'clientName': 'IOS_MESSAGES_EXTENSION',
                    'clientVersion': '16.46',
                    'clientScreen': 'EMBED',
                    'deviceModel': 'iPhone14,3'
                }
            },
            "videoId": videoId
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => reject(err))
    })
}

const getNext = (videoId) => {
    return new Promise((resolve, reject) => {
        axios.post('https://www.youtube.com/youtubei/v1/next?prettyPrint=false', {
            "context": {
                "client": {
                    "clientName": "WEB",
                    "clientVersion": "2.20240322.01.00",
                    "hl": 'vi',
                    "gl": 'vn',
                }
            },
            "videoId": videoId
        })
            .then(res => {
                resolve(res.data.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results)
            })
            .catch(err => reject(err))
    })
}

export default { search, getHint, getVideo, getNext }