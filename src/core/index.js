import { EVENTS_LISTENER_TYPE, EVENT_MESSAGE_TYPE, WINDOW_VARIABLE } from "../shared/constants";
import "./custom-element/microfrontend-iframe-wrap";

class MicrofrontendWrap {
    router = null;
    
    constructor(router = null, entryDOMNode = null) {
        this._listenMessageEvent();
        this._createGlobalStateInstance();

        this.router = router;
        this.router.setEntryDOMNode(entryDOMNode);
    }

    _listenMessageEvent() {
        window.addEventListener(EVENTS_LISTENER_TYPE.MESSAGE, (event) => {
            const data = event.data;
            if (data && data.hasMicrofrontendWrapSignature) {
                switch(data.event) {
                    case EVENT_MESSAGE_TYPE.NAVIGATE:
                        this.router.navigateTo(data.data);
                        break;
                    case EVENT_MESSAGE_TYPE.STORE:
                        if (data.data) {
                            window[WINDOW_VARIABLE.MICROFRONTEND_WRAP][data.data.name] = data.data.data;
                        }
                        break;
                    case EVENT_MESSAGE_TYPE.CUSTOM_EVENT:
                        if (data.data) {
                            const customEvent = new CustomEvent(data.data.name, {
                                detail: data.data.data
                            });
                            window.dispatchEvent(customEvent);
                        }
                        break;
                }
            }
        });
    }

    _createGlobalStateInstance() {
        window[WINDOW_VARIABLE.MICROFRONTEND_WRAP] = {};
    }
}

export default MicrofrontendWrap;