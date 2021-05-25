import Vue from 'vue';
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import './plugins/vuetify'
import App from './App.vue';

import store from './store';

import router from './router';

const middlewareLink = setContext(() => ({
  headers: {
    authorization: `Bearer ${store.getters.getAuthToken}`,
  },
}));

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/'
});

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphql-errors: ', graphQLErrors);
    console.log('network-errors: ', networkError);
  },
  cache,
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueApollo);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
