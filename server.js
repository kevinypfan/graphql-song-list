const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');


const PORT = 3000;

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

app.listen(PORT);