export class VNode {
    tag = null;
    attr = {
        id: null,
        className: null,
        style: null,
        src: null,
        href: null,
        url: null,
        alt: null
    };
    props = {
        innerHTML: null,
        innerText: null,
        textContent: null
    };
    children = null;

    // strictly internal
    _VPage = null;
    _DOMNode = null;
    _childrenDOMNode = null;

    constructor(
        tag = null,
        attr = null,
        props = null,
        children = null
    ) {
        this.tag = tag;
        this.attr = attr;
        this.props = props;
        this.children = children;
    }

    render(parentDOMNode, VPage) {
        this._VPage = VPage;

        this._DOMNode = document.createElement(this.tag);

        if (this.attr !== null) {
            if (this.attr.id !== undefined) {
                this._DOMNode.id = this.attr.id;
            }
    
            if (this.attr.className !== undefined) {
                this._DOMNode.className = this.attr.className;
            }
    
            if (this.attr.style !== undefined) {
                Object.keys(this.attr.style).forEach((sKey) => this._DOMNode.style[sKey] = this.attr.style[sKey]);
            }
    
            if (this.attr.src !== undefined) {
                this._DOMNode.src = this.attr.src;
            }
    
            if (this.attr.href !== undefined) {
                this._DOMNode.href = this.props.href
            }

            if (this.attr.url !== undefined) {
                this._DOMNode.setAttribute('url', this.attr.url);
            }
        }

        if (this.props !== null) {
            if (this.props.innerHTML !== undefined) {
                this._DOMNode.innerHTML = this.props.innerHTML;
            }
    
            if (this.props.innerText !== undefined) {
                this._DOMNode.innerText = this.props.innerText;
            }
    
            if (this.props.textContent !== undefined) {
                this._DOMNode.textContent = this.props.textContent;
            }
        }

        if (this.children !== null) {
            this.children.forEach(child => {
                child.render(this._DOMNode, this._VPage);
            });
        }

        parentDOMNode.appendChild(this._DOMNode);

        return this._DOMNode;
    }
}