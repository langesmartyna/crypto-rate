import React, {Component} from 'react';
import './Crypto.css';

import axios from 'axios';
import CryptoList from './CryptoList';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom/cjs/react-dom.development';



class Crypto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cryptoList : []

        };
    }

    componentDidMount() {
        this.getCryptoData();
    }


    getCryptoData = () => {

        axios.get('https://blockchain.info/pl/ticker')
        .then(res => {
            const tickers = res.data;

            this.setState((state) => {
                let newCryptoList = [];

                for (const [ticker, cryptoRate] of Object.entries(tickers)) {
                    let newCryptoObj = {
                        currency : ticker,
                        symbol : cryptoRate.symbol,
                        buy: cryptoRate.buy,
                        sell: cryptoRate.sell,
                        lastRate: cryptoRate.last,

                    }

                    newCryptoList.push(newCryptoObj);
                }

            })
            console.log(res.data);

        });
    }

    render() {
        return(
            <div className="Crypto">
                <CryptoList />
            </div>
        );
    }
}

export default Crypto;
