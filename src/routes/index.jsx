import HomePage from "../pages/HomePage"
import ResultsPage from "../pages/ResultsPage"
import WatchPage from "../pages/WatchPage"

const routes = [
    { path: "/results", component: ResultsPage },
    { path: "/watch", component: WatchPage, hideSidebar: true, disableMaxWidth: true, disablePadding: true },
    { path: "/", component: HomePage }
]

export { routes }