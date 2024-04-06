import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Youtube from '../../utils/Youtube'
import css from './css/watchpage.module.css'

const WatchPage = () => {
    const [query,] = useSearchParams()
    const [videoId, setVideoId] = useState(null)

    const [videoDetail, setVideoDetail] = useState({})
    const [audioURL, setAudioURL] = useState([])
    const [currentPlayer, setCurrentPlayer] = useState(null)

    const [playerState, setPlayerState] = useState(null)

    const [listNext, setListNext] = useState([])

    const navigate = useNavigate()

    const audioRef = useRef(null)

    const [recommend, setRecommend] = useState(false)

    const changePlayerState = (key, value) => {
        setPlayerState(prev => {
            const playerStateCP = { ...prev }
            playerStateCP[key] = value
            return playerStateCP
        })
    }

    useEffect(() => {
        setVideoId(query.get('v'))
    }, [query])

    useEffect(() => {
        if (videoId !== null)
            Youtube.getNext(videoId)
                .then(data => setListNext(data))
                .catch(err => console.error(err))
    }, [videoId])

    useEffect(() => {
        if (videoId !== null)
            Youtube.getVideo(videoId)
                .then(data => {
                    setVideoDetail(data)
                    let audioURLCP = []
                    for (const cData of data.streamingData.adaptiveFormats) {
                        if (cData.mimeType.includes("audio"))
                            audioURLCP.push(cData)
                    }
                    setAudioURL(audioURLCP)
                })
                .catch(err => console.error(err))
    }, [videoId])

    useEffect(() => {
        if (audioURL.length > 0)
            setCurrentPlayer({
                type: 'audio',
                url: audioURL[audioURL.length - 1].url
            })
    }, [audioURL])

    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            audio.onloadedmetadata = () => {
                changePlayerState("isPlaying", !audio.paused)
                changePlayerState("duration", Math.floor(audio.duration))
                changePlayerState("repeat", false)
                changePlayerState("random", false)
                changePlayerState("currentTime", audio.currentTime)
                audio.ontimeupdate = (e) => {
                    changePlayerState("currentTime", e.target.currentTime)
                }
            }
        }
    }, [audioRef, currentPlayer])

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)

        const formattedSeconds = String(remainingSeconds).padStart(2, '0')

        return `${minutes}:${formattedSeconds}`
    }

    return (
        <div style={{ height: '100%' }}>
            {currentPlayer && <>
                <div>
                    <audio autoPlay={true} loop={playerState?.repeat} preload="metadata" ref={audioRef} src={currentPlayer.url} />
                </div>
            </>}
            {(audioRef.current && playerState) && <div className={css.playerContainer}>
                <div className={css.playlistContainer}>
                    <div className={css.playlist} style={{ transform: recommend ? 'translateX(calc(100% + 50px))' : '' }}>
                        <div><h3>Để xuất</h3></div>
                        {listNext.map((elm, index) => elm.compactVideoRenderer ? <div key={index} onClick={() => navigate(`/watch?v=${encodeURI(elm.compactVideoRenderer.videoId)}`)}>
                            <div className={css.thumbnailContainer}>
                                <img src={elm.compactVideoRenderer.thumbnail?.thumbnails[0].url} />
                                <div>{elm.compactVideoRenderer.lengthText?.simpleText}</div>
                            </div>
                            <div>
                                <h4>
                                    {elm.compactVideoRenderer.title.simpleText}
                                </h4>
                                <div className={css.moreVideoInformation}>
                                    <div>{elm.compactVideoRenderer.shortViewCountText?.simpleText} - {elm.compactVideoRenderer.publishedTimeText?.simpleText}</div>
                                    <div className={css.vAvatarContainer}><img className={css.miniAvatar} src={elm.compactVideoRenderer.channelThumbnail.thumbnails[0].url} /> {elm.compactVideoRenderer.shortBylineText.runs[0].text}</div>
                                </div>
                            </div>
                        </div> : <Fragment key={index} />)}
                    </div>
                </div>
                <div className={css.controlContainer}>
                    <div style={{ maxHeight: '10px' }}>
                        <input onMouseDown={() => audioRef.current.pause()} type='range' className={css.time} min={0} value={Math.floor(playerState.currentTime)} onChange={(e) => {
                            changePlayerState("currentTime", e.target.value)
                            audioRef.current.currentTime = e.target.value
                        }} onMouseUp={() => {
                            if (playerState.isPlaying)
                                audioRef.current.play()
                        }} step={1} max={Math.floor(playerState.duration)} />
                    </div>
                    <div className={css.informationContainer}>
                        <div className={css.leftInformation}>
                            <div className={css.title}>
                                {videoDetail.videoDetails.title}
                            </div>
                            <div className={css.author}>
                                {videoDetail.videoDetails.author}
                            </div>
                        </div>
                        <div className={css.navigation}>
                            <button style={{ color: playerState.repeat ? '#2FB4FC' : "#fff" }} onMouseDown={() => changePlayerState('repeat', !playerState.repeat)}><i className="fa-solid fa-repeat"></i></button>
                            <button><i className="fa-solid fa-backward-step"></i></button>
                            <button onMouseDown={() => {
                                if (!audioRef.current.paused) audioRef.current.pause()
                                else audioRef.current.play()

                                changePlayerState("isPlaying", !audioRef.current.paused)
                            }}>{audioRef.current.paused ? <i className="fa-solid fa-play"></i> : <i className="fa-solid fa-pause"></i>}</button>
                            <button><i className="fa-solid fa-forward-step"></i></button>
                            <button><i className="fa-solid fa-shuffle"></i></button>
                        </div>
                        <div className={css.rightInformation}>
                            <div>
                                {formatTime(playerState.duration)}
                            </div>
                            <div>
                                <button onClick={() => setRecommend(!recommend)}><i className="fa-solid fa-bars"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div >
    )
}

export default WatchPage