const mongoose = require("mongoose");
const { ApolloServer, gql } = require('apollo-server');

//-----------------------------------------------------------------------------
// MONGODB + MONGOOSE
//-----------------------------------------------------------------------------

// const uri = "";

// /*mongoose
//     .connect(uri)
//     .then(() => {})
//     .catch(err => console.log(err));*/


// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }
    type Query {
        title: String
    }
`;


//-----------------------------------------------------------------------------
// SERVER LAUNCH
//-----------------------------------------------------------------------------

const server = new ApolloServer({ typeDefs });
const port = process.env.PORT || 4000;
server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
