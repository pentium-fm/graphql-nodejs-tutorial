const { GraphQLID, GraphQLList } = require('graphql')
const { userType } = require('../types')

module.exports = {
  user: {
    type: userType,
    args: {
      id: {type: GraphQLID}
    },
    resolve: async (parent, args, context) => await context.select('*').from('users').where({id: args.id}).then((rows) => rows.shift())
  },
  users: {
    type: new GraphQLList(userType),
    resolve: async (parent, args, context) => await context.select('*').from('users')
  }
}