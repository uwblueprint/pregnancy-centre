const express = require("express");
const cors = require("cors"); 
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

app.listen(4000, () => {});
