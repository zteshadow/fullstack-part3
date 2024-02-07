
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

let typeDefs = `
type Query {
    bookCount: Int!
    authorCount: Int!
}
`
const resolvers = {
    Query: {
        bookCount: () => 7,
        authorCount: () => 5
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then( ({ url }) => {
    console.log(`Server running at ${url}`)
})
