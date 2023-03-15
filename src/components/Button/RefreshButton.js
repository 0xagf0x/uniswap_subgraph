import React from 'react';
import './Button.scss'
import refreshIcon from '../../images/icon-refresh.svg';

const RefreshButton = (props) => {
  return (
    <button className="btn" type="button"  onClick={props.click}>
      <img className="icon" src={refreshIcon} alt="refresh"/>
      <span>{props.text}</span>
    </button>
  )
}

export default RefreshButton