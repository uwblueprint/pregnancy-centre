<<<<<<< HEAD
const mongoose = require("mongoose");
=======
require('dotenv').config();
import mongoose from 'mongoose';
>>>>>>> dc3f7d76a92a5062c4c9108ad7758d639f6d90f5
const { ApolloServer, gql } = require('apollo-server');

// TODO: need to make script to build(compile) prod server and to run prod server

//-----------------------------------------------------------------------------
// MONGODB + MONGOOSE
//-----------------------------------------------------------------------------

<<<<<<< HEAD
// const uri = "";

// /*mongoose
//     .connect(uri)
//     .then(() => {})
//     .catch(err => console.log(err));*/
=======
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
>>>>>>> dc3f7d76a92a5062c4c9108ad7758d639f6d90f5


// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

<<<<<<< HEAD
const typeDefs = gql`
    type Book {
        title: String
        author: String
    }
    type Query {
        title: String
    }
`;

=======
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
>>>>>>> dc3f7d76a92a5062c4c9108ad7758d639f6d90f5

//-----------------------------------------------------------------------------
// SERVER LAUNCH
//-----------------------------------------------------------------------------

const server = new ApolloServer({ typeDefs });
const port = process.env.PORT || 4000;
server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
