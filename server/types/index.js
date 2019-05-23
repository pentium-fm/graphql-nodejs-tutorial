const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql')

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLID},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    posts: {
      type: new GraphQLList(postType),
      resolve: async (parent, args, context) => await context.select('*').from('posts').where({user_id: parent.id})
    }
  })
})

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    body: {type: GraphQLString},
    user: {
      type: userType,
      resolve: async (parent, args, context) => await context.select('*').from('users').where({id: parent.user_id}).then((rows) => rows.shift())
    }
  })
})

module.exports = {
  userType,
  postType
}