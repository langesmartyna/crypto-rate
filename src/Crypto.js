import React, {Component} from 'react';
import './Crypto.css';

import axios from 'axios';
import CryptoList from './CryptoList';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom/cjs/react-dom.development';



class Crypto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cryptoList : [],
            filterCryptoList: [],

        };
    }

    componentDidMount() {
        this.getCryptoData();
        this.timerID = setInterval(() => this.getCryptoData(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }


    getCryptoData = () => {

        axios.get('https://blockchain.info/pl/ticker')
        .then(res => {
            const tickers = res.data;

            this.setState((state) => {
                let newCryptoList = [];

                for (const [ticker, cryptoRate] of Object.entries(tickers)) {

                    let lastCryptoObj = state.cryptoList.find((cryptoObj) => {
                        return(cryptoObj.currency === ticker);
                    })

                    let newCryptoObj = {
                        currency : ticker,
                        symbol : cryptoRate.symbol,
                        buy: cryptoRate.buy,
                        sell: cryptoRate.sell,
                        lastRate: cryptoRate.last,

                    }

                    if (lastCryptoObj !== undefined) {
                        if (newCryptoObj.lastRate > lastCryptoObj.lastRate) {
                            newCryptoObj.cssClass = 'green';
                            newCryptoObj.htmlArray = String.fromCharCode(8593);
                        } else if (newCryptoObj.lastRate < lastCryptoObj.lastRate) {
                            newCryptoObj.cssClass = 'red';
                            newCryptoObj.htmlArray = String.fromCharCode(8595);
                        } else {
                            newCryptoObj.cssClass = 'blue';
                            newCryptoObj.htmlArray = String.fromCharCode(8596);
                        }


                    } else {
                        newCryptoObj.cssClass = 'blue';
                        newCryptoObj.htmlArray = String.fromCharCode(8596);
                    }

                    newCryptoList.push(newCryptoObj);
                }

                return ({
                    cryptoList: newCryptoList

                })

            });

            this.filterCryptoList();
            
        });
    }

    filterCryptoList = () => {
        this._inputFilter.value = this._inputFilter.value.trim().toUpperCase();

       
        this.setState((state) => {
            let newFilteredCryptoList = state.cryptoList.filter((cryptoObj) => {
                return(cryptoObj.currency.includes(this._inputFilter.value));
            });

            return({
                newFilteredCryptoList: newFilteredCryptoList
            });

        });
    }

    render() {
        return(
            <div className="Crypto">
                <input ref={element => this._inputFilter = element} onChange={this.filterCryptoList} type="text" placeholder="filter" />
                <CryptoList cryptoList={this.state.filteredCryptoList} />
            </div>
        );
    }
}

export default Crypto;
