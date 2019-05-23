const { GraphQLID, GraphQLList } = require('graphql')
const { postType } = require('../types')

module.exports = {
  post: {
    type: postType,
    args: {
      id: {type: GraphQLID}
    },
    resolve: async (parent, args, context) => await context.select('*').from('posts').where({id: args.id}).then((rows) => rows.shift())
  },
  posts: {
    type: new GraphQLList(postType),
    args: {
      user_id: {type: GraphQLID}
    },
    resolve: async (parent, args, context) => await context.select('*').from('posts')
  }
}