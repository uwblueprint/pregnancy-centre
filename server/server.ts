import { mongo } from "mongoose";

const express = require("express");
const cors = require("cors"); 
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const app = express();
/* Info on packages used:
- cors: for use later in security - can validate API calls made only from our web-host
- TODO: tslint deprecated in favor of eslint
*/

//-----------------------------------------------------------------------------
// CORS
//-----------------------------------------------------------------------------


//-----------------------------------------------------------------------------
// MONGODB + MONGOOSE
//-----------------------------------------------------------------------------

const uri = "";

mongoose
    .connect(uri)
    .then(() => {})
    .catch(err => console.log(err));

//-----------------------------------------------------------------------------
// SERVER SETUP
//-----------------------------------------------------------------------------

app.use(cors());
app.use(express.json()); // use express's middleware to parse JSON from body of POSTs or PUTs


//-----------------------------------------------------------------------------
// API
//-----------------------------------------------------------------------------

app.use('/api', graphqlHTTP)


//-----------------------------------------------------------------------------
// SERVER LAUNCH
//-----------------------------------------------------------------------------

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});
