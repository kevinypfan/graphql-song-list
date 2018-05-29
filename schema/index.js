const path = require('path')
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas')
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')), { all: true });

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;