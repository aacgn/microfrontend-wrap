import { Router } from "../../../src/core/router/router";
import WelcomePage from "./pages/WelcomePage";

const routes = [
    {
        path: '/',
        page: WelcomePage
    }
];

export default new Router({
    routes: routes,
    mode: "history"
});;