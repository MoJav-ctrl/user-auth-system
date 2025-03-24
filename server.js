const app = require('./app');
const config = require('./config/config');

const PORT = config.port || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
