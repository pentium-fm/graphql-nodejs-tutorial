const { GraphQLObjectType } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const { userType } = require('../types')

// Create publisher subscriber
const pubsub = new PubSub()
// Subscription keys
const USER_CREATED = 'USER_CREATED'

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    userCreated: {
      type: userType,
      subscribe: () => pubsub.asyncIterator(USER_CREATED),
    }
  }
})

module.exports = Subscription