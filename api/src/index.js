require('module-alias/register');

const config = require('#app/config');
const app = require('#app/app');

app.listen(config.port, () => {
    console.log(`Server is now running on port ${config.port} ! :)`);
});
