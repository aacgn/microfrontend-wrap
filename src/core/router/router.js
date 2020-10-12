import { NAVIGATION_MODE } from "../../shared/constants";

export class Router {
    routes = null;
    mode = null;
    loadingPage = null;

    // methods to be defined based on navigation mode
    currentPath = null;
    navigateTo = null;

    // strictly internal
    _VPage = null;
    _entryDOMNode = null;

    constructor(config = null)
    {
        this.routes = config.routes;
        this.mode = config.mode;
        this.loadingPage = config.loadingPage;

        this._defineNavigationMethods();
        this._listenWindowLoadEvent();
    }

    setEntryDOMNode(parentDOMNode) {
        this._entryDOMNode = parentDOMNode;
    }

    _defineNavigationMethods() {
        switch(this.mode) {
            case NAVIGATION_MODE.HASH:
                this.currentPath = () => {
                    const path = window.location.pathname;
                    return path ? path : '/';
                };
                this.navigateTo = (path) => {
                    window.history.pushState(
                        {},
                        path,
                        window.location.origin + path
                    );
                };
                this._modifyAndListenWindowHistoryState();
                break;
            case NAVIGATION_MODE.HISTORY:
            default:
                this.currentPath = () => {
                    const path = location.hash.slice(1).toLowerCase();
                    return path ? path : '/';
                };
                this.navigateTo = (path) => {
                    window.location.hash = path;
                };
                this._listenWindowHashChange();
                break;
        }
    }

    _listenWindowLoadEvent() {
        window.addEventListener('load', () => {
            this._matchRoute();
        }); 
    }

    _modifyAndListenWindowHistoryState() {
        history.pushState = ( f => function pushState(){
            const ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);
        
        history.replaceState = ( f => function replaceState(){
            const ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('locationchange', () => {
            if (this._entryDOMNode)
                this._matchRoute();
        });

        window.addEventListener('popstate', () => {
            if (this._entryDOMNode)
                this._matchRoute();
        })
    }

    _listenWindowHashChange() {
        window.addEventListener('hashchange', () => {
            if (this._entryDOMNode)
                this._matchRoute();
        });
    }

    _matchRoute() {
        if (this._VPage !== null) {
            this._VPage.destroy();
        }
        const route = this.routes.find(r => r.path === this.currentPath());
        if (route) {
            this._VPage = route.page();
            this._VPage.render(this._entryDOMNode);
        }
        else {
            this._VPage = null;
        }
    }

}