import { THROW_ERROR_MESSAGES, WINDOW_VARIABLE } from "../../shared/constants";

export class VPage {
    state = {
        key: null,
        value: null
    };

    onInit = () => {};
    onBeforeInit = () => {};
    onUpdate = () => {};
    onBeforeDestroy = () => {};
    onDestroy = () => {};

    content = () => {};

    // strictly internal
    _entryDOMNode = null;
    _childDOMNode = null;
    _prevStateValue = null;

    constructor(
        state = null,
        onInit = () => {},
        onUpdate = () => {},
        onDestroy = () => {},
        content = null
    ) {
        this.state = state;
        this.onInit = onInit;
        this.onUpdate = onUpdate;
        this.onDestroy = onDestroy;
        this.content = content;

        this._createStateReferenceInstance();
    }

    _createStateReferenceInstance() {
        const state = window[WINDOW_VARIABLE.MICROFRONTEND_WRAP];

        if (state === null || state === undefined)
        {
            throw Error(THROW_ERROR_MESSAGES.STATE_NOT_INITIALIZED);
        }

        window[WINDOW_VARIABLE.MICROFRONTEND_WRAP][this.state.key] = this.state.value;
        this._prevStateValue = JSON.parse(JSON.stringify(this.state.value));
    }

    _useStateReferenceCheckAndUpdate() {
        setInterval(() => {
            if (JSON.stringify(this._prevStateValue) !== JSON.stringify(this.state.value)) {
                this._destroyContent();
                this.onUpdate();
                this._renderContent();

                this._prevStateValue = JSON.parse(JSON.stringify(this.state.value));
            }
        });
    }

    render(entryDOMNode) {
        this.onBeforeInit();
        this._entryDOMNode = entryDOMNode;
        this._renderContent();
        this._useStateReferenceCheckAndUpdate();
        this.onInit();
    }

    _renderContent() {
        if (this._entryDOMNode !== null) {
            const vDOMContent = this.content();
            this._childDOMNode = vDOMContent.render(this._entryDOMNode, this);
        }
    }

    destroy() {
        this.onBeforeDestroy();
        this._destroyContent();
        this._entryDOMNode = null;
        // Clear any openned javascript intervals
        for (var i = setTimeout(function() {}, 0); i > 0; i--) {
            window.clearInterval(i);
            window.clearTimeout(i);
            if (window.cancelAnimationFrame) window.cancelAnimationFrame(i);
        }
        this.onDestroy();
    }

    _destroyContent() {
        if (this._entryDOMNode !== null && this._childDOMNode !== null) {
            this._entryDOMNode.removeChild(this._childDOMNode);
            this._childDOMNode = null;
        }
    }
}