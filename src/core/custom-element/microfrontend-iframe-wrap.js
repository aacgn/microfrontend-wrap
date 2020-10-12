"use strict";

import { WINDOW_VARIABLE } from "../../shared/constants";

class MicrofrontendIFrameWrap extends HTMLElement {
    constructor() {
        super();
    }

    get url() {
        return this.getAttribute("url") || "";
    }

    connectedCallback() {
        requestAnimationFrame(() => {
            const frameElement = document.createElement('iframe');
            frameElement.sandbox.add("allow-same-origin");
            frameElement.sandbox.add("allow-scripts");
            frameElement.sandbox.add("allow-popups");
            frameElement.sandbox.add("allow-forms");
            frameElement.frameBorder = 0;
            this.appendChild(frameElement);
            const { contentWindow, contentDocument } = frameElement;
            if (!contentDocument || !contentWindow) 
                return;
            const containerHTMLDocument = document.implementation.createHTMLDocument();
            
            fetch(this.url, { mode: "cors", referrerPolicy: "origin-when-cross-origin"})
            .then((response) => {
                const containerHTML = response.text();

                if (containerHTML) {
                    containerHTMLDocument.documentElement.innerHTML = containerHTML;
                    const containerBase = document.createElement("base");
                    containerBase.href = this.url;
                    containerHTMLDocument.head.insertAdjacentElement("afterbegin", containerBase);
                    if (contentWindow) {
                        Object.defineProperty(contentWindow, WINDOW_VARIABLE.MICROFRONTEND_WRAP, { value: window[WINDOW_VARIABLE.MICROFRONTEND_WRAP] });
                    }
                    if (contentDocument) {
                        contentDocument.write(containerHTMLDocument.documentElement.innerHTML);
                        contentDocument.close();
                    }
                }
            })
            .catch(() => {
                return;
            });
        });
    }

    disconnectedCallback() {
    }
}

customElements.define('microfrontend-iframe-wrap', MicrofrontendIFrameWrap);