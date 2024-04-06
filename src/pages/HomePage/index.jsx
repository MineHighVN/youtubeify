import React, { useEffect } from 'react'
import css from './css/homepage.module.css'
import axios from 'axios'

const HomePage = () => {
    useEffect(() => {
    }, [])

    return (
        <div className={css.container}>
            <div className={css.trySearchBox}>
                <h2>Thử tìm kiếm để bắt đầu</h2>
                <span>Hãy bắt đầu xem video để giúp chúng tôi tạo trang để xuất những video mà bạn có thể yêu thích</span>
            </div>
        </div>
    )
}

export default HomePage