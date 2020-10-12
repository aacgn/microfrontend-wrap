import { VNode } from './vnode';

export function createMicrofrontendIframeWrap(config = null) {
    const { attr, props } = config;

    let filteredAttr = null;
    let filteredProps = null;

    if (attr)
    {
        const { src, href, ...otherAttr } = attr;
        filteredAttr = otherAttr;
    }
    
    if (props)
    {
        const { innerHTML, innerText, textContent, children, ...otherProps } = props;
        filteredProps = otherProps;
    }

    return new VNode('microfrontend-iframe-wrap', filteredAttr, filteredProps);
}