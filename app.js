const express = require('express')
const expressQraphql = require('express-graphql')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = require('graphql')

const app = new express()

const users = [
  {
    id: 1,
    firstName: "test",
    lastName: "test"
  },
  {
    id: 2,
    firstName: "test 2",
    lastName: "test 2"
  },
  {
    id: 3,
    firstName: "test 3",
    lastName: "test 3"
  },
]

// Types
const userType = new GraphQLObjectType({
  name: 'userType',
  fields: () => ({
    id: {type: GraphQLID},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString}
  })
})

const Queries = {
  user: {
    type: userType,
    args: {
      id: {type: GraphQLID}
    },
    resolve: (parent, args, context) => user = users.filter( user => user.id == args.id ).shift()
  },
  users: {
    type: new GraphQLList(userType),
    resolve: (parent, args, context) => users
  }
}

// Queries
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    ...Queries
  }
})

// Schema
const schema = new GraphQLSchema({
  query: RootQuery
})

app.use('/graphql', expressQraphql({
  schema,
  graphiql: true
}))

app.listen(3000, () => {
  console.log('Server started at port: 3000')
  console.log('http://localhost:3000')
})