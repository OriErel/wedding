const express = require('express');
const favicon = require('serve-favicon');

const bodyParser = require('body-parser');

const app = express();

const clientRoot = `${__dirname}/../client`;

app.use(favicon(`${clientRoot}/favicon.ico`));
app.use(express.static(clientRoot));

app.use(bodyParser.json());

require('./routes/static')(app);
require('./routes/admin')(app);
require('./routes/guest')(app);

const port = 6006;
app.listen(port, () => {
    console.log(`Server is up! port ${port}`);
});

exports = module.exports = app;