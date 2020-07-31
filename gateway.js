const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'users', url: 'http://localhost:4000/graphql' },
        { name: 'posts', url: 'http://localhost:4001/graphql' }
    ]
});

(async () => {
    const server = new ApolloServer({
        gateway,
        engine: false,
        subscriptions: false,
    });

    const {url} = await server.listen({port: 4002});
    console.log(`Server ready at ${url}.`);
})();