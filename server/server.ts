import mongoose = require("mongoose");
const { ApolloServer, gql } = require('apollo-server');

//-----------------------------------------------------------------------------
// MONGODB + MONGOOSE
//-----------------------------------------------------------------------------

const uri = "";

/*mongoose
    .connect(uri)
    .then(() => {})
    .catch(err => console.log(err));*/


//-----------------------------------------------------------------------------
// APOLLO SETUP
//-----------------------------------------------------------------------------

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }
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
