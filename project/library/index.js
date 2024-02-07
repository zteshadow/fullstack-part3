
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

let books = [
    {
        "title": "Clean Code",
        "author": "Robert Martin",
        "published": 2008,
        "genres": ["refactoring"]
    },
    {
        "title": "Agile software development",
        "author": "Robert Martin",
        "published": 2002,
        "genres": ["agile", "patterns", "design"]
    },
    {
        "title": "Refactoring",
        "author": "Martin Fowler",
        "published": 1999,
        "genres": ["refactoring"]
    },
    {
        "title": "Crime and Punishment",
        "author": "Fyodor Dostoevsky",
        "published": 1866,
        "genres": ["classic", "crime"]
    }
]

let authors = [
    {
      "name": "Robert Martin",
      "bookCount": 2
    },
    {
      "name": "Martin Fowler",
      "bookCount": 1
    },
    {
      "name": "Fyodor Dostoevsky",
      "bookCount": 2
    },
    {
      "name": "Joshua Kerievsky",
      "bookCount": 1
    },
    {
      "name": "Sandi Metz",
      "bookCount": 1
    },
  ]

let typeDefs = `
type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
}

type Author {
    name: String!
    bookCount: Int!
}

type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String): [Book!]!
}
`
const resolvers = {
    Query: {
        bookCount: () => 7,
        authorCount: () => 5,
        allAuthors: () => authors,
        allBooks: (root, args) => {
            if (!args.author) {
                return books
            }
            return books.filter(book => book.author === args.author)
        }
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
