var webpack = require('webpack'),
	path = require("path");

module.exports = {
	devtool: 'eval',
	context: path.join( __dirname + '/app'),
	entry: {
		app: './app.js',
		vendor: ['angular','angular-ui-router']
	},
	output: {
		path: path.join(__dirname, "dist/build"),
		filename: 'app.bundle.js'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
	],
	resolve: {
		extensions: ['', '.js', '.json', '.coffee']
	}
};