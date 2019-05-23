const express = require('express')
const { graphiqlExpress, graphqlExpress } = require('graphql-server-express')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { createServer } = require('http')
const bodyParser = require('body-parser')
const {
  GraphQLObjectType,
  GraphQLSchema,
  execute,
  subscribe
} = require('graphql')
const knex = require('knex')
const knexfile = require('./knexfile')
// Queries
const {userQueries, postQueries} = require('./server/queries')
// Mutations
const {userMutations, postMutations} = require('./server/mutations')
// database connection
const database = knex(knexfile.development)
// init the express app
const app = new express()
// build queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    ...userQueries,
    ...postQueries
  }
})
// build mutations
const mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    ...userMutations,
    ...postMutations
  }
})
// build subscriptions
const subscriptions = require('./server/subscriptions')
// Schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations,
  subscription: subscriptions
})
// set-up the endpoint
const PORT = 3000

/*app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  context: database
}))*/

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  context: database
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}))

// create a server
const server = createServer(app)

server.listen(PORT, () => {
  console.log('Server started at port: 3000')
  console.log('http://localhost:3000')
  // Init subscription
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server,
    path: '/subscriptions'
  })
})