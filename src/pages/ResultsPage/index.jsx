import React, { Fragment, useEffect, useRef, useState } from 'react'
import css from './css/resultspage.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Youtube from '../../utils/Youtube'

const ResultsPage = () => {
    const [query,] = useSearchParams()
    const [results, setResults] = useState([])
    const videoIndex = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        Youtube.search(query.get("search_query"))
            .then(data => {
                window.scrollTo(0, 0)
                setResults(data)
            })
            .catch(err => console.error(err))
    }, [query])

    const cnvToText = (data) => {
        return data?.map((elm, index) => {
            return <span key={index} style={{ fontWeight: elm.bold ? "bold" : 500, fontStyle: elm.italic ? "italic" : "" }}>{elm.text}</span>
        })
    }

    const VideoRenderer = ({ data }) => {
        return <div className={css.video} onClick={() => navigate(`/watch?v=${encodeURI(data.videoId)}`)}>
            <div className={css.thumbnailContainer}>
                <img src={data.thumbnail?.thumbnails[0].url} />
                <div>{data.lengthText?.simpleText}</div>
            </div>
            <div>
                <h3>
                    {data.title.runs[0]?.text}
                </h3>
                <div className={css.moreVideoInformation}>
                    <div>{data.shortViewCountText?.simpleText} - {data.publishedTimeText?.simpleText}</div>
                    <div className={css.vAvatarContainer}><img className={css.miniAvatar} src={data.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails[0].url} /> {data.ownerText.runs[0].text}</div>
                    {data.detailedMetadataSnippets && <div>{cnvToText(data.detailedMetadataSnippets[0].snippetText.runs)}</div>}
                </div>
            </div>
        </div>
    }

    return (
        <div className={css.results}>
            {results.map((elm, index) => {
                const elmEntries = Object.entries(elm)[0];
                const type = elmEntries[0];
                const data = elmEntries[1];

                const isSpecial = !(type === "videoRenderer" || type === "shelfRenderer" || type === "channelRenderer");

                const border = '2px solid #3F3F3F';

                let nextType = results[index + 1] ? Object.entries(results[index + 1])[0][0] : null;

                if (type === "videoRenderer") videoIndex.current++;
                else videoIndex.current = 0;

                let paddingTop = (type !== "videoRenderer" || videoIndex.current === 1) ? '20px' : '7px';
                let paddingBottom = type === "videoRenderer" ? (nextType !== type ? "20px" : "7px") : "20px";

                return isSpecial ? <Fragment key={index}></Fragment> : <div key={index} style={{ paddingTop, paddingBottom, borderBottom: nextType !== type ? border : '' }}>
                    {type === "channelRenderer" && <div className={css.channelContainer}>
                        <div>
                            <img className={css.avatar} src={data.thumbnail.thumbnails[0].url} />
                        </div>
                        <div className={css.content}>
                            <h3 style={{ fontSize: 20 }}>
                                {data.title.simpleText}
                            </h3>
                            <div>
                                <div>{data.subscriberCountText?.simpleText}{data.videoCountText ? ` - ${data.videoCountText?.simpleText}` : ''}</div>
                                <div style={{ marginTop: '2px' }}>{cnvToText(data.descriptionSnippet?.runs)}</div>
                            </div>
                        </div>
                    </div>}
                    {type === "shelfRenderer" && <div className={css.videoContainer}>
                        <h2>{data.title.simpleText}</h2>
                        {data.content.verticalListRenderer?.items.map((elm, index) => <VideoRenderer data={elm.videoRenderer} key={index} />)}
                    </div>}
                    {type === "videoRenderer" && <div className={css.videoContainer}><VideoRenderer data={data} /></div>
                    }
                </div>;
            })}
        </div >
    )
}

export default ResultsPage