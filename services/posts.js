const {
    ApolloServer,
    gql
} = require("apollo-server");
const {
    buildFederatedSchema
} = require("@apollo/federation");

const typeDefs = gql `
  extend type Query {
    post(id: ID!): Post
    posts: [Post]
  }
  
  type Post @key(fields: "id") {
    id: ID!
    user: User
    body: String
  }

  extend type User @key(fields: "id") {
    id: ID! @external
  }
`;

const posts = [{
        id: 1,
        userID: 1,
        body: 'Cool'
    },
    {
        id: 2,
        userID: 2,
        body: 'Nice'
    }
];

const resolvers = {
    Post: {
        user(post) {
            return { __typename: "User", id: post.userID };
        },
        __resolveReference(object) {
            return posts.find(post => post.id === object.id);
        }
    },
    Query: {
        posts(_, args) {
            return posts;
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{
        typeDefs,
        resolvers
    }])
});

(async () => {
    const {url} = await server.listen({
        port: 4001
    });

    console.log(`Server ready at ${url}`);
})();
