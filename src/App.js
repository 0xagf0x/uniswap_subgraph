import React, {useEffect, useState} from 'react';
import { useQuery, gql, ApolloProvider} from '@apollo/client';

//  local imports
import RefreshButton from './components/Button/RefreshButton';
import uniswapLogo from '../src/images/logo-uniswap.png';
import arrowIcon from '../src/images/icon-arrow.svg';
import  './components/Gradient.js';

// schema for requested data
const V3_SUBGRAPH_DATA = gql`
  query data {
    pools(orderBy: totalValueLockedUSD, orderDirection: desc, after: null) {
      id
      totalValueLockedUSD
      volumeUSD
    },
    tokens(orderBy: totalValueLocked, orderDirection: desc, after: null) {
      id
      symbol
      totalValueLocked
      volumeUSD
    },
    swaps(orderBy: timestamp, orderDirection: desc) {
      id
      amountUSD
      timestamp
      sender
    }
  }
`;

function App() {
  // const { loading, error, data, refetch } = useQuery(V3_SUBGRAPH_DATA);
  const { loading, error, data, refetch } = useQuery(V3_SUBGRAPH_DATA, {
    variables: {
      offset: 0,
      limit: 10,
    },
  });
  // statehooks for capturing the elapsed time
  const [timeElapsed, setTimeElapsed] = useState('');
  // pagination variables
  const [poolTable, setPoolTable] = useState(0);
  const [tokenTable, setTokenTable] = useState(0);
  const [swapTable, setSwapTable] = useState(0);

  useEffect(() => {
    // loops over swap times
    if (data) {
      data.swaps.forEach(swap => {
        // calls the timeDifference() fn and passes in current Datetime and the swap timestamp as the args
        timeDifference(Math.floor(Date.now() / 1000), swap.timestamp);
      });
    }
  }, [data]);

  // calculates the time since swap
  function timeDifference(current, previous) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
      setTimeElapsed(Math.round(elapsed/1000) + ' seconds ago')
    } else if (elapsed < msPerHour) {
      setTimeElapsed(Math.round(elapsed/msPerMinute) + ' minutes ago')
    } else if (elapsed < msPerDay ) {
      setTimeElapsed(Math.round(elapsed/msPerHour ) + ' hours ago')
    } else if (elapsed < msPerMonth) {
      setTimeElapsed('approximately ' + Math.round(elapsed/msPerDay) + ' days ago')
    } else if (elapsed < msPerYear) {
      setTimeElapsed('approximately ' + Math.round(elapsed/msPerMonth) + ' months ago')
    } else {
      setTimeElapsed('approximately ' + Math.round(elapsed/msPerYear ) + ' years ago')
    }
  }

  // checks to see if data is loading or if there's an error, if so - return the correct message
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  // take data and slices into increments of 10
  const poolsData = data.pools.slice(poolTable * 10, poolTable * 10 + 10);
  const tokenData = data.tokens.slice(tokenTable * 10, tokenTable * 10 + 10);
  const swapsData = data.swaps.slice(swapTable * 10, swapTable * 10 + 10);

  return (
    // ApolloProvider is a component provided by the Apollo Client for managing state and data in a React app using GraphQL. It's used to provide an instance of the Apollo Client to the React component tree.
    <ApolloProvider>
      <canvas id="gradient-canvas" data-js-darken-top data-transition-in></canvas>
      <div className='container'>
        <div className='container__block'>
          {/* page header */}
          <div className="container__block__page-header">
            <img className='container__block__page-header__img' src={uniswapLogo} alt="logo" />
            <h4 className="container__block__page-header__title">Uniswap V3 Subgraph</h4>
          </div>
        </div>

        {/* refresh button */}
        <RefreshButton
          text="Refresh"
          // calls the refetch() fn onclick, to refetch data
          click={() => refetch()}
        />

        {/* main content */}
        <div className='container__block'>
          <div className="container__block__table-header">
            <h4 className="container__block__table-header__title">Top Pools</h4>
          </div>
          <div className='container__block__pagination-row'>
            <button 
              className='container__block__pagination-row__button'
              disabled={poolTable === 0} 
              onClick={() => setPoolTable(poolTable - 1)}
            >
              <img 
                className='container__block__pagination-row__button__arrow'
                src={arrowIcon} 
                alt="arrow" 
              />
            </button>
            <button
              className='container__block__pagination-row__button'
              disabled={data.pools.length < 10}
              onClick={() => setPoolTable(poolTable + 1)}
            >
              <img 
                className='container__block__pagination-row__button__arrow rotate'
                src={arrowIcon} 
                alt="arrow" 
              />
            </button>
          </div>
          <table className='table'>
            <thead className='table-head'>
              <tr className='top-row'>
                <th>Pool ID</th>
                <th>Total Value Locked (USD)</th>
                <th>24Hr Volume (USD)</th>
              </tr>
            </thead>
            <tbody>
              {poolsData.map((pool) => (
                <tr key={pool.id}>
                  <td>{pool.id}</td>
                  <td>{pool.totalValueLockedUSD.replace(/^(\d+\.\d{2}).*/, "$1")}</td>
                  <td>{pool.volumeUSD.replace(/^(\d+\.\d{2}).*/, "$1")}</td>
                </tr>
              ))}
             
            </tbody>
          </table>
        </div>

        <div className='container__block'>
          <div className="container__block__table-header">
            <h4 className="container__block__table-header__title">Tokens</h4>
          </div>
          <div className='container__block__pagination-row'>
            <button 
              className='container__block__pagination-row__button'
              disabled={tokenTable === 0} 
              onClick={() => setTokenTable(tokenTable - 1)}
            >
              <img 
                className='container__block__pagination-row__button__arrow'
                src={arrowIcon} 
                alt="arrow" 
              />
            </button>
            <button
              className='container__block__pagination-row__button'
              disabled={data.tokens.length < 10}
              onClick={() => setTokenTable(tokenTable + 1)}
            >
              <img 
                className='container__block__pagination-row__button__arrow rotate'
                src={arrowIcon} 
                alt="arrow" 
              />
            </button>
          </div>
          <table className='table'>
            <thead className='table-head'>
              <tr className='top-row'>
                <th>Token ID</th>
                <th>Symbol</th>
                <th>totalValueLocked</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {tokenData.map((token) => (
                <tr key={token.id}>
                  <td>
                    <a 
                    className='td-link' 
                    href={'https://etherscan.io/address/' + token.id} 
                    target="_blank" 
                    rel="noreferrer">
                      {token.id.substring(0,18)}...
                    </a>
                  </td>
                  <td>{token.symbol}</td>
                  <td>{token.totalValueLocked.replace(/^(\d+\.\d{2}).*/, "$1")}</td>
                  <td>{token.volumeUSD.replace(/^(\d+\.\d{2}).*/, "$1")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className='container__block'>
          <div className="container__block__table-header">
            <h4 className="container__block__table-header__title">Transactions</h4>
          </div>
          <div className='container__block__pagination-row'>
            <button 
              className='container__block__pagination-row__button'
              disabled={swapTable === 0} 
              onClick={() => setSwapTable(swapTable - 1)}
            >
              <img 
                className='container__block__pagination-row__button__arrow'
                src={arrowIcon} 
                alt="arrow" 
              />
            </button>
            <button
              className='container__block__pagination-row__button'
              disabled={data.swaps.length < 10}
              onClick={() => setSwapTable(swapTable + 1)}
            >
              <img 
                className='container__block__pagination-row__button__arrow rotate'
                src={arrowIcon} 
                alt="arrow" 
              />
            </button>
          </div>
          <table className='table'>
            <thead className='table-head'>
              <tr className='top-row'>
                <th>Token ID</th>
                <th>Total Value</th>
                <th>Timestamp</th>
                <th>Sender</th>
              </tr>
            </thead>
            <tbody>
              {swapsData.map((swap) => (
                <tr key={swap.id}>
                  <td>
                    <a
                    className='td-link' 
                    href={'https://etherscan.io/tx/' + swap.id} 
                    target="_blank" 
                    rel="noreferrer">
                      {swap.id.substring(0,18)}...
                    </a>
                  </td>
                  <td>{swap.amountUSD.replace(/^(\d+\.\d{2}).*/, "$1")}</td>
                  <td>{timeElapsed}</td>
                  <td>{swap.sender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
