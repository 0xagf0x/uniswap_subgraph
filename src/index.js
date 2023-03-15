import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import App from './App';
import Footer from './components/Footer/Footer';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';



const root = ReactDOM.createRoot(document.getElementById('root'));
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  cache: new InMemoryCache(),
});


root.render(
  <ApolloProvider client={client}>
    <App />
    <Footer />
  </ApolloProvider>
);
