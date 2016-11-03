import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'

require('./../../style/modules/option.less');
const utils = require('../../lib/utils');
const storage = require('../../lib/storage');
const Promise = require('bluebird');

document.title =chrome.i18n.getMessage('ext_name');

Promise.join(storage.getOptions(), storage.getSymbolAndRates())
    .then(([options, {symbols}]) => {

        let reducer = function (state = {options, symbols}, action) {
            switch (action.type) {
                case 'update':
                    return action.data;
                    break;
                default:
                    return state;
                    break;
            }
        }

        let store = createStore(reducer)

        let App = React.createClass({

            getInitialState(){
                return {
                    options: store.getState().options,
                    symbols: store.getState().symbols,
                }
            },

            submitHandler([name,value]){

                let options = this.state.options;
                switch (name) {
                    case 'query':
                        options.query.dropdown.enable = options.query.dropdown.enable ? false : true;
                        break;
                    case 'preferCurrency':
                        options.price.preferCurrency=value;
                        break;
                    case 'changeColor':
                        options.price.changeColor=value;
                        break;
                    case 'enable':
                        options.price.badge.enable = options.price.badge.enable ? false : true;
                        break;
                    case 'source':
                        var market =this.refs.changeMarket;
                        options.price.badge.source=market.value;
                    default:
                        break;
                }

                storage.set({options: options});
                Promise.join(storage.getOptions(), storage.getSymbolAndRates())
                    .then(([options, {symbols}]) => {
                        store.dispatch(addAction('update', {options, symbols}))
                        this.setState({
                            options: store.getState().options,
                            symbols: store.getState().symbols,
                        })
                    })
            },

            render(){
                return (
                    <div className="container">
                        <div className="row">

                            <div className="page-header">
                                <h1>{chrome.i18n.getMessage('setting_title')}</h1>
                            </div>

                            <form className="settings">
                                <div className="setting-section">
                                    <h2>{chrome.i18n.getMessage('setting_section_query')}</h2>
                                    <div className="setting-group">
                                        <label>
                                            <input type="checkbox"
                                                   checked={this.state.options.query.dropdown.enable ? true : false}
                                                   onChange={this.submitHandler.bind(this,['query',''])}
                                            />
                                            <span>{chrome.i18n.getMessage('setting_section_query_dropdown_enable')}</span>
                                        </label>
                                        <div className="help-text">{chrome.i18n.getMessage('setting_section_query_dropdown_enable_helptext')}</div>
                                    </div>
                                </div>
                                <div className="setting-section">
                                    <h2>{chrome.i18n.getMessage('setting_section_currency')}</h2>
                                    <div className="setting-group">
                                        <div className="setting-row">
                                            <label>
                                                <input type="radio" name="priceCurrency" value="USD"
                                                       checked={this.state.options.price.preferCurrency=='USD' ? true : false}
                                                       onChange={this.submitHandler.bind(this,['preferCurrency','USD'])}
                                                />
                                                <span>{chrome.i18n.getMessage('setting_section_currency_prefer_usd')}</span>
                                            </label>
                                        </div>
                                        <div className="setting-row">
                                            <label>
                                                <input type="radio" name="priceCurrency" value="CNY"
                                                       checked={this.state.options.price.preferCurrency=='CNY' ? true : false}
                                                       onChange={this.submitHandler.bind(this,['preferCurrency','CNY'])}
                                                />
                                                <span>{chrome.i18n.getMessage('setting_section_currency_prefer_cny')}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="setting-section">
                                    <h2>{chrome.i18n.getMessage('setting_section_price')}</h2>
                                    <div className="setting-group">
                                        <div className="setting-row">
                                            <label>
                                                <input type="radio" name="priceChangeColor" value="RED_UP_GREEN_DOWN"
                                                       checked={this.state.options.price.changeColor=='RED_UP_GREEN_DOWN' ? true : false}
                                                       onChange={this.submitHandler.bind(this,['changeColor','RED_UP_GREEN_DOWN'])}
                                                />
                                                <span>{chrome.i18n.getMessage('setting_section_price_RED_UP_GREEN_DOWN')}</span>
                                            </label>
                                        </div>
                                        <div className="setting-row">
                                            <label>
                                                <input type="radio" name="priceChangeColor" value="RED_DOWN_GREEN_UP"
                                                       checked={this.state.options.price.changeColor=='RED_DOWN_GREEN_UP' ? true : false}
                                                       onChange={this.submitHandler.bind(this,['changeColor','RED_DOWN_GREEN_UP'])}
                                                />
                                                <span>{chrome.i18n.getMessage('setting_section_price_RED_DOWN_GREEN_UP')}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="setting-group">
                                        <label>
                                            <input type="checkbox" className="settings-checkbox"
                                                   checked={this.state.options.price.badge.enable ? true : false}
                                                   onChange={this.submitHandler.bind(this,['enable',''])}
                                            />
                                            <span>{chrome.i18n.getMessage('setting_section_price_browserbadge_enable')}</span>
                                        </label>
                                        {
                                            this.state.options.price.badge.enable ?
                                                <select style={{marginLeft: 10}}
                                                        ref="changeMarket"
                                                        value={this.state.options.price.badge.source}
                                                        onChange={this.submitHandler.bind(this,['source',''])}
                                              >
                                                    {this.state.symbols.map(s=> {
                                                        return <option key={s.symbol} value={s.symbol}>{exchangeName(s)}</option>
                                                    })}
                                                </select>
                                                : ''
                                        }

                                        <div className="help-text">{chrome.i18n.getMessage('setting_section_price_browserbadge_enable_helptext')}</div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                )
            }
        })
        
        let root = document.createElement('div')
        document.body.appendChild(root);
        ReactDOM.render(<App/>, root)
    });

function addAction(type, json) {
    return {
        type: type,
        data: json
    }
}

function exchangeName(symbol) {
    return symbol[`platform_${utils.getLocale()}`];
}
