const {
    ApolloServer,
    gql
} = require("apollo-server");
const {
    buildFederatedSchema
} = require("@apollo/federation");

const typeDefs = gql `
  extend type Query {
    user(id: ID!): User
    users: [User]
  }
  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const users = [{
        id: 1,
        name: 'Foo',
        username: 'foo'
    },
    {
        id: 2,
        name: 'Bar',
        username: 'bar'
    }
];

const resolvers = {
    User: {
        __resolveReference(object) {
            return users.find(user => user.id == object.id);
        }
    },
    Query: {
        users(_, args) {
            return users;
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
        port: 4000
    });

    console.log(`Server ready at ${url}`);
})();
