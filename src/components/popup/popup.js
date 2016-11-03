import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Search from './Search'
import Markets from './Markets'
import Footer from './Footer'

const storage = require('../../lib/storage');
require('./../../style/modules/popup.less');
require('./ga');


function addAction(type, json) {
    return {
        type: type,
        data: json
    }
}

storage.snapshot()
    .then(initialState=> {

        let reducer = function (state, action) {
            if (typeof(state) === 'undefined') {
                state = initialState
            }
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

            exchanges(){
                loop.call(this);
                function loop() {
                    storage.snapshot().then(result=> {
                        store.dispatch(addAction('update', result))
                        setTimeout(()=> {
                            loop.call(this)
                        }, 1500)
                    })
                }
            },

            componentDidMount(){
                this.exchanges();
            },
            render() {
                return (
                    <Provider store={store}>
                        <div className="main-body">
                            <div className="container">
                                <div className="row">
                                    <Search/>
                                    <Markets/>
                                    <Footer/>
                                </div>
                            </div>
                        </div>
                    </Provider>
                )
            }
        })


        let root = document.createElement('div')
        document.body.appendChild(root);
        ReactDOM.render(<App/>, root)

    })

