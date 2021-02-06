require('dotenv').config();
const mongoose = require('mongoose');
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


// //-----------------------------------------------------------------------------
// // APOLLO SETUP
// //-----------------------------------------------------------------------------

const typeDefs = require('./schema.ts')

//-----------------------------------------------------------------------------
// SERVER LAUNCH
//-----------------------------------------------------------------------------

const server = new ApolloServer({ typeDefs });
const port = process.env.PORT || 4000;
server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
