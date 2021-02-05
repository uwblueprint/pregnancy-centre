require('dotenv').config();
import mongoose from 'mongoose';
const { ApolloServer, gql } = require('apollo-server');

// TODO: need to make script to build(compile) prod server and to run prod server

//-----------------------------------------------------------------------------
// MONGODB + MONGOOSE
//-----------------------------------------------------------------------------

const uri = "";
const options = {

};

/*mongoose.connect(uri, options);
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});*/


//-----------------------------------------------------------------------------
// APOLLO SETUP
//-----------------------------------------------------------------------------

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

const resolvers = {
    Query: {
      books: () => books,
    },
  };

//-----------------------------------------------------------------------------
// SERVER LAUNCH
//-----------------------------------------------------------------------------

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
