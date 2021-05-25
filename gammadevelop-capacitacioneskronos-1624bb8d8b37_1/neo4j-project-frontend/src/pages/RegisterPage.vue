<template>
  <v-app style="background-color: white;">
    <v-toolbar app flat color="transparent">
      <v-toolbar-title
        class="fontT"
        style="font-size: 3em; margin-top: 2em; margin-left: 1em"
        >GhettoGram</v-toolbar-title
      >
    </v-toolbar>

		<v-content>
      <div>
        <div class="centered">
					<v-card v-show="registered" class="pb-4 pt-4" style="border-radius: 1em;">
						<v-avatar
						size="60px"
						style="margin-left:14em"
					><img src="@/assets/v.svg" /></v-avatar>
					<v-card-title class="FsemiBold mt-1" style="font-size: 25px; margin-left:6.5em">ALL SET!</v-card-title>
          <v-card-text class="ml-4 Fregular">
            The registration process was successful. You can now log in.
          </v-card-text>
          <v-card-actions>
            <v-btn style="color: white; margin-left:11.5em" color="#0D78B4" @click="$router.replace('/login')">Go to log in</v-btn>
          </v-card-actions>
        </v-card>
          <v-card v-show="!registered">
            <div class="bodyCard">
              <div style="text-align: center;">
                <span class="display-3">Register</span>
              </div>
              <div class="label mb-1 mt-1" style="font-size: 18px">
              <label>User name</label>
            </div>
            <v-text-field
              :loading="registerLoading ? 'green accent-3' : false"
              :disabled="registerLoading ? true : false"
              :rules="[() => !!formUsername || 'Username is required.', false]"
              v-model="formUsername"
              :error-messages="usernameErrors"
              solo
              background-color="#c4c4c420"
              required
            />
              <div class="label mb-1" style="font-size: 18px">
              <label>First name</label>
            </div>
            <v-text-field
              :loading="registerLoading ? 'green accent-3' : false"
              :disabled="registerLoading ? true : false"
              v-model="formFirstName"
              :rules="[
                () => !!formFirstName || 'First name is required.',
                false,
              ]"
              solo
              background-color="#c4c4c420"
              required
            />
						<div class="label mb-1" style="font-size: 18px">
              <label>Last name</label>
            </div>
            <v-text-field
              :loading="registerLoading ? 'green accent-3' : false"
              :disabled="registerLoading ? true : false"
              v-model="formLastName"
              :rules="[() => !!formLastName || 'Last name is required.', false]"
              solo
              background-color="#c4c4c420"
              required
            />
						<div class="label mb-1" style="font-size: 18px">
              <label>Email</label>
            </div>
            <v-text-field
              :loading="registerLoading ? 'green accent-3' : false"
              :disabled="registerLoading ? true : false"
              v-model="formEmail"
              :rules="[() => !!formEmail || 'E-mail is required.', false]"
              :error-messages="emailErrors"
              solo
              background-color="#c4c4c420"
              required
            />
            <div class="label mb-1" style="font-size: 18px">
              <label>Password</label>
            </div>
            <v-text-field
              :loading="registerLoading ? 'green accent-3' : false"
              :disabled="registerLoading ? true : false"
              v-model="formPassword"
              :rules="[() => !!formPassword || 'Password is required.', false]"
              solo
              background-color="#c4c4c420"
              required
              type="password"
            />
            </div>
            <v-card-actions>
              <v-btn
                color="#0D78B4"
                style="width: 23em;
								color: white;
								font-family: 'Open Sans', sans-serif;
								font-size: 16px;"
                class="layoutCenter mt-1"
								:disabled="registerLoading ? true : false"
								@click="register"
              >Register</v-btn
              >
            </v-card-actions>
						<div style="padding-bottom: 5%">
						<header class="mt-3" style="font-size: 1.3em; margin-left: 5.5em;">
              Do you have an account already?
            </header>
						<v-btn
							style="margin-left: 13em; font-family: 'Open Sans', sans-serif;"
							flat
							color="616161" @click="$router.replace('/login')">Log in</v-btn>
						</div>
          </v-card>
        </div>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import gql from "graphql-tag";
export default {
  beforeMount() {
    if (this.$store.getters.getCurrentUser.username !== null) {
      this.$router.replace("/home");
    }
  },
  data() {
    return {
      formUsername: null,
      formFirstName: null,
      formLastName: null,
      formEmail: null,
      formPassword: null,
      usernameErrors: null,
      emailErrors: null,
      disponibilityOfUsername: null,
      disponibilityOfEmail: null,
      registerLoading: false,
      registered: false,
    };
  },
  watch: {
    disponibilityOfUsername: function() {
      if (!this.disponibilityOfUsername.available) {
        this.usernameErrors = "Username already in use.";
      } else {
        this.usernameErrors = null;
      }
    },
    disponibilityOfEmail: function() {
      if (!this.disponibilityOfEmail.available) {
        this.emailErrors = "E-mail already in use.";
      } else {
        this.emailErrors = null;
      }
    },
  },
  apollo: {
    disponibilityOfEmail: {
      query: gql`
        query disponibilityOfEmail($email: String!) {
          disponibilityOfEmail(email: $email) {
            available
          }
        }
      `,
      variables() {
        return {
          email: this.formEmail,
        };
      },
      debounce: 500,
      skip() {
        if (this.formEmail === null) return true;

        return false;
      },
    },
    disponibilityOfUsername: {
      query: gql`
        query disponibilityOfUsername($username: String!) {
          disponibilityOfUsername(username: $username) {
            available
          }
        }
      `,
      variables() {
        return {
          username: this.formUsername,
        };
      },
      debounce: 500,
      skip() {
        if (this.formUsername === null) return true;

        return false;
      },
    },
  },
  methods: {
    register() {
      if (
        this.formUsername &&
        this.formEmail &&
        this.formFirstName &&
        this.formLastName &&
        this.formPassword &&
        this.usernameErrors === null &&
        this.emailErrors === null
      ) {
        this.registerLoading = true;

        this.$apollo
          .mutate({
            mutation: gql`
              mutation(
                $firstName: String!
                $lastName: String!
                $username: String!
                $email: String!
                $password: String!
              ) {
                register(
                  firstName: $firstName
                  lastName: $lastName
                  username: $username
                  email: $email
                  password: $password
                ) {
                  registered
                }
              }
            `,
            variables: {
              firstName: this.formFirstName,
              lastName: this.formLastName,
              username: this.formUsername,
              email: this.formEmail,
              password: this.formPassword,
            },
          })
          .then((data) => {
            if (data.data.register.registered) {
              this.registered = true;
            }
          });
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');

.Flight{
	font-family: 'Open Sans', sans-serif;
	font-weight: 300;
}
.Fregular{
	font-family: 'Open Sans', sans-serif;
	font-weight: 400;
}
.FsemiBold{
	font-family: 'Open Sans', sans-serif;
	font-weight: 600;
}
.Fbold{
	font-family: 'Open Sans', sans-serif;
	font-weight: 700;
}
.postCards{
	width: 35em; 
	border-radius: 1em
}
body,
html {
  height: 100%;
}
.bodyCard {
  padding-top: 5%;
  padding-left: 10%;
  padding-right: 10%;
}
</style>
