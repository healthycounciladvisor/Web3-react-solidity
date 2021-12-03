import React from "react";
import PropTypes from "prop-types";

import Wrapper from "../styles/WalletButton.styles";
import { Check } from "../assets/icons";

const WalletButton = (props) => {
  const { name, connectFunction, Icon, activating, active } = props;

  const handleClick = () => {
    connectFunction && connectFunction();
  };
  return (
    <Wrapper onClick={handleClick}>
      <div className='container'>
        <div className='label-container'>
          <p>{activating ? "Connecting..." : name}</p>
          {active && <Check className='check' />}
        </div>
        {<Icon className='icon' />}
      </div>
    </Wrapper>
  );
};

WalletButton.propTypes = {
  name: PropTypes.string,
  connectFunction: PropTypes.func,
  selected: PropTypes.bool,
  activating: PropTypes.bool,
  active: PropTypes.bool,
  Icon: PropTypes.shape({
    type: PropTypes.oneOf(["img, svg"]),
  }),
};

export default WalletButton;
