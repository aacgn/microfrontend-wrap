import { VNode } from './vnode';

export function createComponent(config = null) {
    const { tag, attr, props, children } = config;
    return new VNode(tag, attr, props, children);
}