const { ApolloServer, ApolloError } = require('apollo-server');
const Neode = require('neode');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const typeDefs = require('./schema.js');

const instance = new Neode.fromEnv();

// Models.
instance.withDirectory(`${__dirname}/models`);

const extractSelections = (selectionSet) => {
  const selections = [];

  // info.fieldNodes[0].selectionSet.selections[0]
  for (let x = 0; x < selectionSet.fieldNodes[0].selectionSet.selections.length; x += 1) {
    if (selectionSet.fieldNodes[0].selectionSet.selections[x].name.value) {
      selections.push(selectionSet.fieldNodes[0].selectionSet.selections[x].name.value);
    }
  }

  return selections;
};

const createSession = async (email, password) => {
  const sessionToken = crypto.randomBytes(Math.ceil(128)).toString('base64').slice(0, 128) + `${Date.now()}`.toString('base64');
  const foundUser = await instance.first('User', 'email', email);

  if (foundUser) {
    const match = await bcrypt.compare(password, foundUser.get('password_hash'));

    if (match) {
      const newSession = await instance.create('Session', {
        token: sessionToken,
      });

      if (newSession) {
        newSession.relateTo(foundUser, 'owned_by', { user: foundUser.get('username') });
      }

      return sessionToken;
    }

    return null;
  }

  return null;
};

const createUser = async (firstName, lastName, username, email, password, admin) => {
  const newUser = await instance.merge('User', {
    first_name: firstName,
    last_name: lastName,
    username,
    email,
    admin,
  }).catch(() => {});

  if (newUser !== undefined) {
    bcrypt.hash(password, 12).then(hash => newUser.update({ password_hash: hash }));

    return newUser;
  }

  return null;
};

const createPost = async (title, body, tags, user) => {
  if (!tags) tags = ' ';
  if (!title) title = ' ';
  if (!body) body = ' ';

  const newPost = await instance.create('Post', {
    title,
    body,
    tags,
  });

  if (newPost) {
    newPost.relateTo(user, 'owned_by', { user: user.get('username') });

    return newPost;
  }

  return null;
};

const createComment = async (body, user, postId) => {
  const newComment = await instance.create('Comment', {
    body,
  });

  if (newComment) {
    newComment.relateTo(user, 'owned_by', { user: user.get('username') });

    const commentPost = await instance.first('Post', 'post_id', postId);

    if (commentPost) {
      newComment.relateTo(commentPost, 'is_in', { post_id: postId });

      const postAuthor = await instance.cypher('MATCH (a:Post {post_id: $postId})-[r:OWNED_BY]-(b:User) RETURN b.username AS c', { postId });

      if (postAuthor) {
        return {
          comment: newComment,
          post: commentPost,
          postAuthor: postAuthor.records[0]._fields[0],
        };
      }
    }
  }

  return null;
};

createUser('Carlos Miguel', 'Gomez Rincon', 'Miguelcarlos23', 'carlos.gomez@alumnos.uneatlantico.es', '123456.', true);

const resolvers = {
  Query: {
    disponibilityOfUsername: async (parent, args) => {
      const username = await instance.first('User', 'username', args.username);

      if (username) {
        return { available: false };
      } else {
        return { available: true };
      }
    },
    disponibilityOfEmail: async (parent, args) => {
      const email = await instance.first('User', 'email', args.email);

      if (email) return { available: false };

      return { available: true };
    },
    getAllPosts: async (parent, args, context) => {
      if (context.currentUser) {
        const posts = await instance.cypher('MATCH (n:Post)-[:OWNED_BY]->(u:User) RETURN n, u');

				console.log(posts);
				
        if (posts) {
          const payload = instance.hydrate(posts, 'n');
					
					console.log(payload);

          let response = [];

          for (let x = 0; x < payload._values.length; x += 1) {
            response.push({
              postId: payload._values[x].get('post_id'),
              title: payload._values[x].get('title'),
              body: payload._values[x].get('body'),
              tags: payload._values[x].get('tags'),
            });
          }
          
          return response;
        }
      }

      return new ApolloError('Unauthorized.', '401');
    },
    getCommentsFromPost: async (parent, args, context) => {
      if (context.currentUser) {
        const commentsFromPost = await instance.cypher('MATCH (n:Comment)-[r:IS_IN]-(p:Post {post_id: $postId}) RETURN n, COLLECT(DISTINCT n)', { postId: args.postId });

        if (commentsFromPost) {
          const payload = instance.hydrate(commentsFromPost, 'n');

          let response = [];

          for (let x = 0; x < payload._values.length; x += 1) {
            response.push({
              commentId: payload._values[x]._properties.get('comment_id'),
              body: payload._values[x]._properties.get('body'),
              post: null,
            });
          }

          
          return response;
        }

        return new ApolloError('Couldn\'t fetch comments from post.', '5647');
      }

      return new ApolloError('Unauthorized.', '401');
    },
    getAuthorOfPost: async (parent, args, context) => {
      if (context.currentUser) {
        const author = await instance.cypher('MATCH (n:Post {post_id: $postId})-[r:OWNED_BY]-(b:User) RETURN b', { postId: args.postId });

        const payload = instance.hydrateFirst(author, 'b');

        if (author) {
          return {
            username: payload.get('username'),
          };
        }

        return new ApolloError('Couldn\'t fetch user.', '8924');
      }

      return new ApolloError('Unauthorized.', '401');
    },
    getAuthorOfComment: async (parent, args, context) => {
      if (context.currentUser) {
        const author = await instance.cypher('MATCH (n:Comment {comment_id: $commentId})-[r:OWNED_BY]-(b:User) RETURN b', { commentId: args.commentId });

        if (author) {
          const payload = instance.hydrateFirst(author, 'b');

          return {
            username: payload.get('username'),
          };
        }

        return new ApolloError('Couldn\'t fetch user.', '8924');
      }

      return new ApolloError('Unauthorized.', '401');
    },
    getUserAssociatedWithToken: (parent, args, context) => {
      if (context.currentUser) {
        return {
          firstName: context.currentUser.get('first_name'),
          lastName: context.currentUser.get('last_name'),
          username: context.currentUser.get('username'),
          email: context.currentUser.get('email'),
        };
      }

      return new ApolloError('Unauthorized.', '401');
    },
    getPostsFromFollowings: async (parent, args, context) => {
      if (context.currentUser) {
        const postFromFollowings = await instance.cypher('MATCH (a:User {username: $username})-[r:FOLLOWS]->(b:User) MATCH (x:Post)-[y:OWNED_BY]->(z:User {username: b.username}) RETURN x, COLLECT(DISTINCT x)', { username: context.currentUser.get('username') });

        if (postFromFollowings) {

          const payload = instance.hydrate(postFromFollowings, 'x');

          let response = [];

          for (let x = 0; x < payload._values.length; x += 1) {
            response.push({
              postId: payload._values[x].get('post_id'),
              title: payload._values[x].get('title'),
              body: payload._values[x].get('body'),
              tags: payload._values[x].get('tags'),
            });
          }
          
          return response;
        }
      }

      return new ApolloError('Unauthorized.', '401');
    },
    getFollowableUsers: async (parent, args, context) => {
      if (context.currentUser) {
        const followableUsers = await instance.cypher('MATCH (x:User) WHERE NOT (:User {username: $username})-[:FOLLOWS]->(x:User) AND x.username <> $username RETURN (x)', { username: context.currentUser.get('username') });

        if (followableUsers) {
          const payload = instance.hydrate(followableUsers, 'x');
          const response = [];

          for (let x = 0; x < payload._values.length; x += 1) {
            response.push({
              username: payload._values[x].get('username'),
              firstName: payload._values[x].get('first_name'),
              lastName: payload._values[x].get('last_name'),
            });
          }

          return response;
        }
      }

      return new ApolloError('Unauthorized.', '401');
    },
    getFollows: async (parent, args, context) => {
      if (context.currentUser) {
        const follows = await instance.cypher('MATCH (x:User {username: $username})-[:FOLLOWS]->(y:User) RETURN (y)', { username: context.currentUser.get('username') });

        if (follows) {
          const payload = instance.hydrate(follows, 'y');
          const response = [];

          for (let x = 0; x < payload._values.length; x += 1) {
            response.push({
              username: payload._values[x].get('username'),
              firstName: payload._values[x].get('first_name'),
              lastName: payload._values[x].get('last_name'),
            });
          }

          return response;
        }
      }

      return new ApolloError('Unauthorized.', '401');
    },
  },
  Mutation: {
    register: async (parent, args) => {
      const createdUser = await createUser(
        args.firstName,
        args.lastName,
        args.username,
        args.email,
        args.password,
        false,
      );

      if (!createdUser) {
        return new ApolloError('User already exists.', '4443');
      }

      return { registered: true };
    },
    login: async (parent, args, context) => {
      if (context.currentUser) return new ApolloError('Already logged in.', '6754');

      const session = await createSession(args.email, args.password);

      if (session !== null) return { token: session };

      return new ApolloError('Given information doesn\'t match.', '5554');
    },
    logout: async (parent, args, context) => {
      if (!context.currentUser) return new ApolloError('No user to log out.', '1876');

      const sessionToDelete = await instance.first('Session', 'token', context.token);

      if (sessionToDelete) {
        sessionToDelete.delete();

        return { loggedOut: true };
      }

      return new ApolloError('Couldn\'t log out user.', '7892');
    },
    createPost: async (parent, args, context) => {
      if (!context.currentUser) return new ApolloError('Unauthorized', '401');

      const newPost = await createPost(args.title, args.body, args.tags, context.currentUser);

      if (newPost) {
        return {
          postId: newPost.get('post_id'),
          title: newPost.get('title'),
          body: newPost.get('body'),
          tags: newPost.get('tags'),
        };
      }

      return new ApolloError('Couldn\'t create post.', '5768');
    },
    createComment: async (parent, args, context, info) => {
      if (!context.currentUser) return new ApolloError('Unauthorized.', '401');

      // console.log('Info: ', extractSelections(info));
      // console.log('Info 2: ', info.fieldNodes[0].selectionSet.selections[1].selectionSet.selections[0]);

      const newComment = await createComment(args.body, context.currentUser, args.postId);

      if (newComment) {
        return {
          body: newComment.comment.get('body'),
          post: {
            postId: newComment.post.get('post_id'),
            title: newComment.post.get('title'),
            body: newComment.post.get('body'),
            tags: newComment.post.get('tags'),
            user: newComment.postAuthor,
          },
        };
      }

      return new ApolloError('Couldn\'t create comment on post.', '112');
    },
    followUser: async (parent, args, context) => {
      if (!context.currentUser) return new ApolloError('Unauthorized.', '401');

      const userToFollow = await instance.first('User', 'username', args.username);

      if (userToFollow) {
        if (context.currentUser.get('username') !== args.username) {
          context.currentUser.relateTo(userToFollow, 'follows', { user: userToFollow.get('username') });

          return {
            follow: true,
          };
        }

        return new ApolloError('Couldn\'t follow user.', '5045');
      }

      return null;
    },
    unfollowUser: async (parent, args, context) => {
      if (context.currentUser) {
        const unfollow = await instance.cypher('MATCH (x:User {username: $username})-[y:FOLLOWS]->(z:User {username: $unfollowUsername}) DELETE (y)', { username: context.currentUser.get('username'), unfollowUsername: args.username });

        if (unfollow) {
          return {
            follow: false,
          };
        }

      }

      return new ApolloError('Unauthorized.', '401');
    },
  },
};

const getCurrentUser = async (token) => {
  const currentUser = await instance.cypher('MATCH (a:Session {token: $token})-[r:OWNED_BY]-(b) RETURN b', { token });

  return instance.hydrateFirst(currentUser, 'b');
};

instance.schema.install().then(() => console.log('Schema installed.'));

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    formatError: error => {
      console.log(error);
      return error;
    },
    formatResponse: response => {
      console.log(response);
      return response;
    },
    context: async ({ req }) => {
      let token;

      if (req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '');
      } else {
        token = null;
      }

      const currentUser = await getCurrentUser(token);

      return { currentUser, token };
    },
  },
);

server.listen().then(({ url }) => {
  console.log(`Server listening at ${url}`);
});
