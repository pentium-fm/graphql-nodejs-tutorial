const express = require('express')
const expressQraphql = require('express-graphql')
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')
const knex = require('knex')
const knexfile = require('./knexfile')

// database connection
const database = knex(knexfile.development)

const app = new express()

// Types
const userType = new GraphQLObjectType({
  name: 'userType',
  fields: () => ({
    id: {type: GraphQLID},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString}
  })
})

// Queries
const Queries = {
  user: {
    type: userType,
    args: {
      id: {type: GraphQLID}
    },
    resolve: async (parent, args, context) => {
      return (await database.select('*').from('users').where({id: args.id})).shift()
    }
  },
  users: {
    type: new GraphQLList(userType),
    resolve: async (parent, args, context) => await database.select('*').from('users')
  }
}


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    ...Queries
  }
})

// Mutations
const UserMutation = {
  addUser: {
    type: userType,
    args: {
      firstName: {
        type: new GraphQLNonNull(GraphQLString)
      },
      lastName: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async (parent, args, context) => {
      return (await database.returning(['id', 'firstName', 'lastName']).insert(args).into('users')).shift()
    }
  },
  editUser: {
    type: userType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      firstName: {
        type: GraphQLString
      },
      lastName: {
        type: GraphQLString
      }
    },
    resolve: async (parent, args, context) => {
      return (await database('users').returning(['id', 'firstName', 'lastName']).update(args).where({id: args.id})).shift()
    }
  },
  deleteUser: {
    type: userType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (parent, args, context) => database('users').where({id: args.id}).del()
  }
}

const mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    ...UserMutation
  }
})

// Schema
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations
})

app.use('/graphql', expressQraphql({
  schema,
  graphiql: true
}))

app.listen(3000, () => {
  console.log('Server started at port: 3000')
  console.log('http://localhost:3000')
})