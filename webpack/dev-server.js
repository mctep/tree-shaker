const { Console } = require('console');
const express = require('express');
const webpack = require('webpack');
const yargs = require('yargs');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const createWebpackConfig = require('./create-config');
const stats = require('./stats');

const logger = new Console(process.stdout, process.stderr);

const PORT_DEFAULT = 8080;
const HOST_DEFAULT = '0.0.0.0';
const HTTP_STATUS_NO_CONTENT = 201;

const argv = yargs
  .default('port', PORT_DEFAULT)
  .default('host', HOST_DEFAULT)
  .alias('p', 'port')
  .alias('h', 'host')
.argv;

const { port, host } = argv;

const app = express();

const compiler = webpack(createWebpackConfig());

app.get('/favicon.ico', (req, res) => {
	res.status(HTTP_STATUS_NO_CONTENT).send();
});

app.use(webpackDevMiddleware(compiler, { stats }));
app.use(webpackHotMiddleware(compiler));

app.listen(port, host, () => {
	logger.log(`Dev server listen http://${host}:${port}`);
});
