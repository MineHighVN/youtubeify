import React, { useEffect, useState } from 'react'
import css from './css/defaultlayout.module.css'
import { Link, useNavigate } from 'react-router-dom'
import Youtube from '../../utils/Youtube'

const allItems = [
    {
        icon: "fa-solid fa-house",
        title: "Home",
        redirectTo: '/'
    }
]

const DefaultLayout = ({ children, hideSidebar, disableMaxWidth, disablePadding }) => {
    const [searchValue, setSearchValue] = useState("")
    const [hintSearch, setHintSearch] = useState([])
    const [hintShow, setHintShow] = useState(false)
    const [hintSelect, setHintSelect] = useState(-1)
    const [hintText, setHintText] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        if (searchValue.replace(/ /g, "") === "") {
            setHintSelect(-1)
            return setHintSearch([])
        }
        Youtube.getHint(searchValue)
            .then(data => setHintSearch(data))
            .catch(err => console.error(err))
    }, [searchValue])

    const search = (data) => {
        if (data) setSearchValue(data)
        const lastSearch = data || hintText || searchValue
        if (lastSearch.replace(/ /g, '').length > 0)
            navigate(`/results?search_query=${encodeURI(lastSearch)}`)
    }

    useEffect(() => {
        const text = hintSearch[hintSelect]
        if (text)
            setHintText(text[0])
        else setHintText(null)
    }, [hintSelect])

    return (
        <div className={css.container}>
            <div className={css.navigation}>
                <div>
                    <img onClick={() => navigate("/")} src="/youtubeify.png" />
                </div>
                <div className={css.searchBoxContainer}>
                    <div className={css.searchBox}>
                        <input
                            autoCorrect='off'
                            onKeyDown={e => {
                                const key = e.key
                                if (key === "ArrowDown" || key === "ArrowUp") {
                                    let select = key === "ArrowDown" ? hintSelect + 1 : hintSelect - 1
                                    if (select < -1) select = hintSearch.length - 1
                                    if (select > hintSearch.length) select = 0
                                    setHintSelect(select)
                                } else if (key === "Enter") {
                                    setHintSearch([])
                                    search()
                                }
                            }}
                            onFocus={() => setHintShow(true)}
                            onBlur={() => {
                                setHintShow(false)
                                setHintSelect(-1)
                            }}
                            value={hintText || searchValue}
                            onChange={e => { setSearchValue(e.target.value); setHintSelect(-1) }}
                            placeholder='Tìm kiếm'
                        />
                        <button onClick={() => setSearchValue("")} className={css.erase}>X</button>
                    </div>
                    <div className={css.searchButton}>
                        <button onClick={() => search()}>Search</button>
                    </div>
                    {(JSON.stringify(hintSearch) !== "[]" && hintShow) && <div className={css.hintBox} >
                        {hintSearch?.map((elm, index) => <div onMouseDown={() => search(elm[0])} className={hintSelect === index ? css.select : ""} key={index}>{elm[0]}</div>)}
                    </div>}
                </div>
                <div></div>
            </div>
            <div className={css.bodyContent}>
                {!hideSidebar && <div className={css.sidebarNav}>
                    {allItems.map((elm, index) => <Link to={elm.redirectTo} key={index}><div><i className={elm.icon}></i></div><div>{elm.title}</div></Link>)}
                </div>}
                <div className={css.childrenContainer}>
                    <div className={css.children} style={{ maxWidth: disableMaxWidth ? 'unset' : '1366px', padding: disablePadding ? '0' : '15px 20px' }}>
                        {children}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DefaultLayout