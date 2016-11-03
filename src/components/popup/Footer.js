import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Footer extends Component{
    render(){
        return (
            <footer className="footer">
                <a href="https://btc.com" target="_blank" style={{verticalAlign: 'top', display: 'inline-block'}}>
                    <i className="icon-btc-logo"></i>
                </a>
                <a href="option.html" target="_btccomblank" className="option">{ chrome.i18n.getMessage('popup_settings') }</a>
            </footer>
        )
    }
}
export default connect()(Footer)
