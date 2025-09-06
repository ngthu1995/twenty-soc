import "./App.css";
import { ApolloProvider } from "@apollo/client/react";
import { InMemoryCache, HttpLink, ApolloClient } from "@apollo/client";
import { SOCHeader } from "./components/Header";
import { Layout } from "./components/Layout";
import { FilterProvider } from "./FilterContext";

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "http://localhost:4000/graphql",
    }),
  });
  return (
    <ApolloProvider client={client}>
      <SOCHeader />
      <FilterProvider>
        <Layout />
      </FilterProvider>
    </ApolloProvider>
  );
}

export default App;
