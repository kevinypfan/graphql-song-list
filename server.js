const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');

const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');


const PORT = 3000;

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
})); // if you want GraphiQL enabled

const server = createServer(app);

server.listen(PORT, () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: '/subscriptions',
    },
  );
});