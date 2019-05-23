const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql')

const { postType } = require('../types')

const postMutations = {
  addPost: {
    type: postType,
    args: {
      title: {
        type: new GraphQLNonNull(GraphQLString)
      },
      body: {
        type: new GraphQLNonNull(GraphQLString)
      },
      user_id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (parent, args, context) => await context.returning(['id', 'title', 'body']).insert(args).into('posts').then((rows) => rows.shift())
  },
  editPost: {
    type: postType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      title: {
        type: GraphQLString
      },
      body: {
        type: GraphQLString
      }
    },
    resolve: async (parent, args, context) => await context('posts').returning(['id', 'title', 'body']).update(args).where({id: args.id}).then((rows) => rows.shift())
  },
  deletePost: {
    type: postType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: (parent, args, context) => context('posts').where({id: args.id}).del()
  }
}

module.exports = postMutations