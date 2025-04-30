const app = require('./app');
const config = require('./config/config');

const port = config.port;

app.listen(port, () => {
  console.log(`Server running in ${config.env} mode on port ${port}`);
});

