import  { VPage } from './vpage';

export function createPage(config = null) {
    const { state, onInit, onUpdate, onDestroy, content } = config;
    return new VPage(state, onInit, onUpdate, onDestroy, content);
}