const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql')
const { PubSub } = require('graphql-subscriptions')

const { userType } = require('../types')
// Create publisher subscriber
const pubsub = new PubSub()
// Subscription keys
const USER_CREATED = 'USER_CREATED'

const userMutations = {
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
      const user = await context.returning(['id', 'firstName', 'lastName']).insert(args).into('users').then((rows) => rows.shift())
      // subscribe the mutation
      pubsub.publish({
        USER_CREATED,
        user
      })
      // return the created user
      return user
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
    resolve: async (parent, args, context) => await context('users').returning(['id', 'firstName', 'lastName']).update(args).where({id: args.id}).then((rows) => rows.shift())
  },
  deleteUser: {
    type: userType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (parent, args, context) => context('users').where({id: args.id}).del()
  }
}

module.exports = userMutations