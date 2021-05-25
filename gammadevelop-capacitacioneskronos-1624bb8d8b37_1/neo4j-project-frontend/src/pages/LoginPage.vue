<template>
  <v-app style="background-color: white;">
    <v-toolbar app flat color="transparent">
      <v-toolbar-title
        class="fontT"
        style="font-size: 3em; margin-top: 2em; margin-left: 1em"
        >GhettoGram</v-toolbar-title
      >
      <v-spacer />
    </v-toolbar>
    <v-content>
      <div>
        <div class="centered">
          <v-card>
            <div class="bodyCard">
              <div style="text-align: center;">
                <span class="display-3">Log in</span>
              </div>
              <div class="label mb-1" style="font-size: 18px">
                <label>Email</label>
              </div>
              <v-text-field
                v-model="emailInput"
                :disabled="loading"
                solo
								rounded
                background-color="#c4c4c420"
                required
              />
              <div class="label mb-1" style="font-size: 18px">
                <label>Password</label>
              </div>
              <v-text-field
                v-model="passwordInput"
                :disabled="loading"
                solo
                background-color="#c4c4c420"
                required
                type="password"
              />
            </div>
            <v-card-actions>
              <v-btn
                @click="logIn"
                :loading="loading"
                color="#0D78B4"
                style="width: 23em;
								color: white;
								font-family: 'Open Sans', sans-serif;
								font-size: 16px"
                class="layoutCenter"
                >Log in</v-btn
              >
            </v-card-actions>
            <header class="mt-4" style="font-size: 1.3em; margin-left: 5.5em">
              You don't have an account yet?
            </header>

            <v-btn
							style="margin-left: 13em; font-family: 'Open Sans', sans-serif;"
							flat
							color="616161" 
							@click="$router.replace('/register')"
              >Register</v-btn
            >
          </v-card>
        </div>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import gql from "graphql-tag";

export default {
  methods: {
    logIn() {
      if (this.emailInput && this.passwordInput) {
        this.loading = true;

        this.$apollo
          .mutate({
            mutation: gql`
              mutation($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                  token
                }
              }
            `,
            variables: {
              email: this.emailInput,
              password: this.passwordInput,
            },
          })
          .then((data) => {
            this.$store.dispatch("addAuthToken", data.data.login.token);

            this.$router.replace("/home");
          })
          .catch(() => {
            // TODO: Catch error.
          });
      }
    },
  },
  data() {
    return {
      emailInput: null,
      passwordInput: null,
      loading: false,
    };
  },
  beforeMount() {
    if (this.$store.getters.getCurrentUser.username !== null) {
      this.$router.replace("/home");
    }
  },
};
</script>
<style>
body,
html {
  height: 100%;
}
.fontT {
  font-family: "Open Sans", sans-serif;
}
.centered {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  padding-left: 38%;
  padding-right: 38%;
}
.layoutCenter {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 35px !important;
}
.bodyCard {
  padding-top: 15%;
  padding-left: 10%;
  padding-right: 10%;
}
</style>
