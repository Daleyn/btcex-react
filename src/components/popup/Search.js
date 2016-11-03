import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
const utils = require('../../lib/utils')

class Search extends Component{
    render(){
        return (
            <div className="search">
                <form method="GET" action={`https://btc.com/${utils.getLocale().replace('_', '-')}/search`} className="search-form" target="_blank">
                    <div className="search-input-wrapper">
                        <input className="search-input" type="search"  name="q" placeholder={chrome.i18n.getMessage('popup_search_placeholder')}
                               autofocus autoComplete="off" spellCheck="false"/>
                    </div>
                    <div className="search-button-wrapper">
                        <button className="search-button"  type="submit">
                            <i className="glyphicon glyphicon-search"></i>
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}
export default connect()(Search)