/* Imports from packages */
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import { setContext } from "@apollo/client/link/context";

/* Imports from local files */
import "./index.css";
import App from "./App";

console.log(`${process.env.REACT_APP_GRAPHQL_SERVER_URL}/graphql`)
console.log(`${process.env.REACT_APP_GRAPHQL_SERVER_URL}`)

const link = createHttpLink({
    uri: `${process.env.REACT_APP_GRAPHQL_SERVER_URL}/graphql`,
    credentials: "include"
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            "Content-Type": "application/graphql"
        }
    };
});

const apolloClient = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache({
        addTypename: false
    })
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={apolloClient}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
