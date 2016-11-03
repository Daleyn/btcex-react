import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
const utils = require('../../lib/utils');
const constants = require('../../lib/constants');
const moment = require('moment');
const $ = require('jquery');


class Markets extends Component {

    componentDidMount() {
        const container = document.getElementsByClassName("price-indicator");

        for (let i = 0; i < container.length; i++) {
            container[i].addEventListener('animationend', function animate() {
                container[i].classList.remove('active-green')
                container[i].classList.remove('active-red')
            }, false);
        }
    }

    render() {
        const {markets, rates, symbols, options} =this.props

        return (
            <div className="markets">
                <table className="markets-table" id="markets-table">
                    <tbody>
                    <tr key="title">
                        <th>{chrome.i18n.getMessage('popup_markets_exchange')}</th>
                        <th>{chrome.i18n.getMessage('popup_markets_latest')}</th>
                        <th>{chrome.i18n.getMessage('popup_markets_exchange')}</th>
                        <th>{chrome.i18n.getMessage('popup_markets_high')}</th>
                        <th>{chrome.i18n.getMessage('popup_markets_vol')}</th>
                    </tr>
                    {
                        symbols.map(item=> {
                            return <tr key={item.symbol}>
                                <td>{ item[`platform_${utils.getLocale()}`] }</td>
                                <td className="price-indicator-td">
                                    <div className={'price-indicator'+' '+markets.data[item.symbol].color}>
                                        <i className={markets.data[item.symbol].change==0 ? 'glyphicon glyphicon-arrow-right': markets.data[item.symbol].change>0 ? 'glyphicon glyphicon-arrow-up' : 'glyphicon glyphicon-arrow-down'}></i>
                                        {options.price.preferCurrency == 'USD' ? ' $ ' : ' ¥ '}{ numberFormat(rates[options.price.preferCurrency] / rates[item.currency_type] * (markets.data[item.symbol].last / 1e3), 2) }
                                        &nbsp;/&nbsp;
                                        {options.price.preferCurrency == 'USD' ? '¥ ' : '$ '}{ numberFormat(rates[options.price.preferCurrency == 'USD' ? 'CNY' : 'USD'] / rates[item.currency_type] * (markets.data[item.symbol].last / 1e3), 2)}
                                    </div>
                                </td>
                                <td>{ numberFormat(markets.data[item.symbol].high / 1e3, 2)}</td>
                                <td>{ numberFormat(markets.data[item.symbol].low / 1e3, 2)}</td>
                                <td>{ numberFormat(markets.data[item.symbol].vol / 1e8, 0)}</td>
                            </tr>

                        })
                    }
                    </tbody>
                </table>

                <div className="text-right markets-lastupdate">
                    <span>{chrome.i18n.getMessage('popup_last_update')}</span>
                    &nbsp;{moment(markets.updatedAt * 1000).format('YYYY/MM/DD HH:mm:ss') }
                </div>
            </div>
        )
    }
}


function numberFormat(number, decimals, decPoint, thousandsSep) {
    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
    decPoint = (decPoint === undefined) ? '.' : decPoint;
    thousandsSep = (thousandsSep === undefined) ? ',' : thousandsSep;

    let sign = number < 0 ? '-' : '';
    number = Math.abs(+number || 0);

    let intPart = parseInt(number.toFixed(decimals), 10) + '';
    let j = intPart.length > 3 ? intPart.length % 3 : 0;

    return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
}

function mapStateToProps(state) {
    let change = 0, oldMarkets;

    localStorage.oldMarkets ? oldMarkets = JSON.parse(localStorage.oldMarkets) : oldMarkets = {};

    if ($.isEmptyObject(oldMarkets)) {
        for (let key in state.markets.data) {
            state.markets.data[key].change = change;
            state.markets.data[key].color = getColor(change, state.options.price.changeColor);
        }
    } else {
        for (let key in state.markets.data) {
            change = state.markets.data[key].last - oldMarkets[key].last;
            state.markets.data[key].change = change;
            state.markets.data[key].color = getColor(change, state.options.price.changeColor);
        }
    }
    localStorage.setItem('oldMarkets', JSON.stringify(state.markets.data));

    return {
        markets: state.markets,
        rates: state.rates,
        symbols: state.symbols,
        options: state.options
    }


}

function getColor(change, changeColor) {
    let color;
    if (change > 0 && changeColor == constants.RED_UP_GREEN_DOWN) color = 'active-red';
    else if (change > 0 && changeColor == constants.RED_DOWN_GREEN_UP) color = 'active-green';
    else if (change < 0 && changeColor == constants.RED_UP_GREEN_DOWN) color = 'active-green';
    else if (change < 0 && changeColor == constants.RED_DOWN_GREEN_UP) color = 'active-red';
    else if (change == 0) color = '';
    // console.log(change + ' ' + color);
    return color;

}

export default connect(mapStateToProps)(Markets)

