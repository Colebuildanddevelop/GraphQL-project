import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
// COLES IMPORTS
import Dashboard from './components/Dashboard';
import {
  Provider as UrqlProvider,
  createClient,
  defaultExchanges,
  subscriptionExchange
} from 'urql';
import { SubscriptionClient } from "subscriptions-transport-ws";

const subscriptionClient = new SubscriptionClient(
  `wss://react.eogresources.com/graphql`,
  {
    reconnect: true,
    timeout: 20000
  }
);

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)      
    }),
  ],
})

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00b0ff',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: '#fafafa',
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <UrqlProvider value={client}>
        <Wrapper>
          <Header />
          <Dashboard />
          <ToastContainer />
        </Wrapper>
      </UrqlProvider>
    </Provider>
  </MuiThemeProvider>
);

export default App;
