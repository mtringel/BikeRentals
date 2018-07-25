// import './css/site.css'; we use wwwroot/Content/Site.css
import 'bootstrap';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import * as RoutesModule from './routes';
import { Store } from './store/store';
import { ClientContextActions } from './store/actions/shared/clientContextActions';
import 'react-select/dist/react-select.min.css';
import 'babel-polyfill';
import 'react-bootstrap-typeahead/css/Typeahead.min.css';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';

let routes = RoutesModule.routes;

(require('es6-promise') as any).polyfill();
var axios = require('axios');

var store: Store = new Store();
export const storeProvider = () => store;

var router: BrowserRouter;
export const routerProvider = () => router;

function startUp() {
    store.dispatch(ClientContextActions.initialize());
}

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;

    ReactDOM.render(
        <AppContainer>
            <BrowserRouter children={routes} basename={baseUrl} ref={r => router = r} />
        </AppContainer>,
        document.getElementById('react-app')
    );
}

startUp();
renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}
