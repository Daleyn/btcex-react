const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //自动构建html

module.exports = {
    entry: {
        option: './src/components/option/option.js',
        background: './src/components/background/background.js',
        popup: './src/components/popup/popup.js',
        lookup: './src/components/lookup/look.js'
    },
    output: {
        path: path.join(__dirname, 'public/assets'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.json$/, loader: "json"},
            {test: /\.css$/, loader: "style!css"},
            {test: /\.less$/, loader: "style!css!less"},
            {
                test: /\.js|jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.(png|jpg|gif)/,
                loader: 'url?limit=10000'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../popup.html',
            title: 'popup',
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            filename: '../option.html',
            title: 'BTC.COM',
            chunks: ['option']
        }),
    ]
};