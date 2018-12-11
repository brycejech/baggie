'use strict';

const path = require('path');

module.exports = {
    entry: './src/Baggie.js',
    output: {
        path:      path.resolve('./dist'),
        filename: 'Baggie.min.js',

        library:  'Baggie',
        libraryTarget: 'umd',
        umdNamedDefine: true,

        // https://github.com/webpack/webpack/issues/6784
        // globalObject: 'typeof self !== \'undefined\' ? self : this'
        globalObject: 'this'
    },
    module: {
		rules: [
			{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
		]
    },
    devtool: 'source-map'
}
