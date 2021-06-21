import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { AppProvider } from "./context/app.context";
import Navigation from './navigation';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPHQL_HOST,
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': process.env.REACT_APP_GRAPHQL_TOKEN
      }
    }),
    cache: new InMemoryCache(),
  });
 };

function App() {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </ApolloProvider>
  );
}

export default App;
