import React, { Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultLayout from './layouts/DefaultLayout'

const App = () => {
    return (
        <Router>
            <Routes>
                {routes.map((elm, index) => {
                    let Layout = DefaultLayout
                    const Page = elm.component

                    if (elm.layout === null) Layout = Fragment
                    return <Route key={index} path={elm.path} element={
                        <Layout hideSidebar={elm.hideSidebar} disablePadding={elm.disablePadding} disableMaxWidth={elm.disableMaxWidth}>
                            <Page />
                        </Layout>
                    } />
                })}
            </Routes>
        </Router>
    )
}

export default App