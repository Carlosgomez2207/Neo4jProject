const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    postId: String
    title: String
    body: String
    tags: String
  }

  type Comment {
    commentId: String
    body: String
    post: Post 
  }

  type User {
    firstName: String
    lastName: String
    username: String
    email: String
  }

  type Disponibility {
    available: Boolean
  }

  type Registration {
    registered: Boolean
  }

  type LogOut {
    loggedOut: Boolean
  }

  type Follow {
    follow: Boolean
  }

  type Session {
    token: String
  }

  type Query {
    getAllPosts: [Post]
    getUserAssociatedWithToken: User
    getPostsFromFollowings: [Post]
    getAuthorOfPost(postId: String!): User
    getAuthorOfComment(commentId: String!): User
    getFollowableUsers: [User]
    getFollows: [User]
    getCommentsFromPost(postId: String!): [Comment]
    disponibilityOfUsername(username: String!): Disponibility
    disponibilityOfEmail(email: String!): Disponibility
  }

  type Mutation {
   register(firstName: String!, lastName: String!, username: String!, email: String!, password: String!): Registration
   login(email: String!, password: String!): Session 
   logout: LogOut
   createPost(title: String, body: String, tags: String): Post
   createComment(body: String!, postId: String!): Comment
   followUser(username: String!): Follow 
   unfollowUser(username: String!): Follow
  }
`;

module.exports = typeDefs;
