/* Imports from packages */
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";

/* Imports from local files */
import "./index.css";
import App from "./App";
import configureStore from "./data/store";

const link = createHttpLink({
  uri: `${process.env.REACT_APP_GRAPHQL_SERVER_URL}/graphql`, credentials: "include",
  headers: { "Content-Type": "application/json" },
});

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: false
  })
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={configureStore()}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
