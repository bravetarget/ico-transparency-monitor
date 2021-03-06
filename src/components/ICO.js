import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onModalShow, showErrorMessage } from '../actions/ModalAction';
import ICOApp from './ICOApp';
import ICOScan from './ICOScan';
import { readSmartContract } from '../actions/web3';
import { isConnected } from '../utils/web3';
import { resetRpc } from '../actions/ScanAction';
import config from '../config';

class ICO extends Component {
  componentDidMount() {
    if (this.props.web3 && !this.props.isSmartContractLoaded) {
      this.props.readSmartContract(this.props.address);
    }
  }

  render() {
    return (
      <div>
        {this.props.isInSingleICOView && <ICOScan address={this.props.address} onModalShow={this.props.onModalShow} />}
        {!this.props.isInSingleICOView && <ICOApp address={this.props.address} onModalShow={this.props.onModalShow} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  web3: state.modal.web3,
  isSmartContractLoaded: state.scan.isSmartContractLoaded,
});

const mapDispatchToProps = (dispatch, state) => ({
  onModalShow: (currentICO) => {
    if (isConnected()) {
      dispatch(onModalShow(currentICO));
    } else {
      dispatch(resetRpc());
      dispatch(showErrorMessage(`Trying to connect to rpc node ${config.rpcHost} received an invalid response.`));
    }
  },
  readSmartContract: (address) => {
    dispatch(readSmartContract(address));
  },
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ICO);
