import { createPage } from "../../../../src/core/vdom/create-page";
import { createComponent } from "../../../../src/core/vdom/create-component";
import { createMicrofrontendIframeWrap } from "../../../../src/core/vdom/create-microfrontend-iframe-wrap";

const WelcomePage = () => createPage(
    {
        state: {
            key: 'welcome',
            value: {
                text: 'Hellou'
            }
        },
        onInit: function() {
            console.log('inited');

            setTimeout(() => {
                this.state.value.text = 'Eu amo João PedroGabriel';
            }, 1000);
        },
        onUpdate: function() {
            console.log('updated');
        },
        onDestroy: function() {
            console.log('destroyed');
        },
        content: function() {
            return createComponent({
                props: {
                    textContent: this.state.value.text
                }
            })
        }
    }
);

export default WelcomePage;