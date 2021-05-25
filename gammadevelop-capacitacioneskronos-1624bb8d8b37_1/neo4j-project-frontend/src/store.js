import Vue from 'vue'
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState({
    key: 'x-connection',
    paths: ['authentication', 'authorization'],
    storage: {
      getItem: key => Cookies.get(key),
      setItem: (key, value) => Cookies.set(key, value, { expires: 2020, secure: false }),
      removeItem: key => Cookies.remove(key),
    },
  })],
  state: {
    authentication: {
      authToken: null,
    },
    authorization: {
      currentUser: {
        firstName: null,
        lastName: null,
        email: null,
        username: null,
      },
    },
  },
  getters: {
    getAuthToken: (state) => {
      return state.authentication.authToken;
    },
    getCurrentUser: (state) => {
      return state.authorization.currentUser;
    },
  },
  mutations: {
    addAuthToken(state, authToken) {
      state.authentication.authToken = authToken;
    },
    addCurrentUser(state, user) {
      state.authorization.currentUser = user;
    },
  },
  actions: {
    addAuthToken({ commit }, token) {
      commit('addAuthToken', token);
    },
    addCurrentUser({ commit }, user) {
      commit('addCurrentUser', user);
    },
    logOut({ commit }) {
      commit('addCurrentUser', { firstName: null, lastName: null, email: null, username: null });
      commit('addAuthToken', null);
    },
  }
});

export default store;
