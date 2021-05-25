<template>
  <v-app style="background-color: white;">
    <div>
      <v-dialog v-model="followDialog" max-width="30vw">
        <v-card class="container" style="width: 41em; border-radius: 1em">
          <v-card-title
            ><h1 class="Fregular">FollowPage</h1></v-card-title
          >
          <v-card-text style="width: 36em">
            <h2 class="Fregular">Users you can follow</h2>
            
            <v-card>
              <v-card-text
								class="mt-2 Flight"
                style="text-align: center; background-color: #F6F6F6"
                v-show="getFollowableUsers.length < 1"
              >
                <b>No users to follow.</b>
              </v-card-text>
              <v-list two-line v-show="getFollowableUsers.length > 0">
                <template v-for="x in getFollowableUsers">
                  <v-list-tile avatar :key="x.username">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ x.username }}</v-list-tile-title>
                      <v-list-tile-sub-title
                        >{{ x.firstName }}
                        {{ x.lastName }}</v-list-tile-sub-title
                      >
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn flat color="blue" @click="followUser(x.username)"
                        >Follow</v-btn
                      >
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </v-list>
            </v-card>
            <br />
            <h2 class="Fregular">Users you follow:</h2>
            <br />
            <v-card>
              <v-card-text
                class="mt-2 Flight"
                style="text-align: center; background-color: #F6F6F6"
                v-show="getFollows.length < 1"
              >
                <b>You don't follow anyone.</b>
              </v-card-text>
              <v-list two-line v-show="getFollows.length > 0">
                <template v-for="x in getFollows">
                  <v-list-tile avatar :key="x.username">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ x.username }}</v-list-tile-title>
                      <v-list-tile-sub-title
                        >{{ x.firstName }}
                        {{ x.lastName }}</v-list-tile-sub-title
                      >
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn flat color="red" @click="unfollowUser(x.username)"
                        >Unfollow</v-btn
                      >
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </v-list>
            </v-card>
            <br />
          </v-card-text>
          <v-card-actions>
            <v-btn color="#0D78B4" @click="followDialog = false"><h4 class="Fregular" style="color: white">Close</h4></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="logOutDialog"  max-width="20vw"
        >
				<div>
				<v-card style="border-radius: 1em;">
          <v-card-title
            ><h1 class="Fregular ml-2 mt-1">Log Out</h1></v-card-title
          >
					<v-card-text>
        <span class="FsemiBold ml-5">Are you sure you want to log out?</span>
      </v-card-text>
          <v-card-actions class="pb-4 mt-2">
            <v-btn style="margin-left: 4em" color="#0D78B4" @click="logOut"><h4 
								class="Fregular" 
								style="color: white">LOG OUT</h4></v-btn>
            <v-spacer />
            <v-btn
						style="margin-right: 4.5em"
              color="#B6B6B6"
              @click="logOutDialog = false"
              ><h4 
								class="Fregular" 
								style="color: white">Cancel</h4></v-btn
            >
          </v-card-actions>
        </v-card>
				</div>
      </v-dialog>
      <v-dialog
        persistent
        v-model="createPostDialog"
        max-width="33vw"
        scrollable
      >
        <v-card style="border-radius: 1em;">
          <v-card-title
            ><h1 class="Fregular ml-2 mt-1">Create post</h1></v-card-title
          >
          <v-card-text>
            <v-text-field
						  solo
							flat
							background-color="#c4c4c420"
							style="width: 28.5em; margin-left: 5.5em"
							v-model="postTitle"
							label="Title" />
            <v-textarea
              v-model="postBody"
              hide-details
              solo
							flat
							background-color="#c4c4c420"
							style="width: 28.5em; margin-left: 5.5em"
              auto-grow
              label="Body"
            />
            <br />
            <v-combobox
              solo
							flat
							background-color="#c4c4c420"
							style="width: 28.5em; margin-left: 5.5em"
              v-model="postTags"
              hide-details
              append-icon=""
              small-chips
              label="Tags"
              multiple
              clearable
            >
              <template v-slot:selection="data">
                <v-chip
                  :selected="data.selected"
                  close
                  @input="removeTag(data.item)"
                >
                  <strong>{{ data.item }}</strong>
                </v-chip>
              </template>
            </v-combobox>
          </v-card-text>
          <v-card-actions class="pb-4 mt-2">
            <v-btn style="margin-left: 7em" color="#0D78B4" @click="createPost"><h4 
								class="Fregular" 
								style="color: white">Post</h4></v-btn>
            <v-spacer />
            <v-btn
						style="margin-right: 4.5em"
              color="#B6B6B6"
              @click="
                () => {
                  postTags = [];
                  postTitle = null;
                  postBody = null;
                  createPostDialog = false;
                }
              "
              ><h4 
								class="Fregular" 
								style="color: white">Cancel</h4></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-toolbar class="mt-5" :flat="shadowOnToolbar" color="white">
        <v-card-title>
          <v-avatar size="60px"><img src="@/assets/profile.png"/></v-avatar>
          <h3 class="ml-2 Fregular">
            Welcome {{ $store.getters.getCurrentUser.username }}
          </h3>
        </v-card-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn flat @click.stop="createPostDialog = true">
            <v-icon left dark>add</v-icon>
            Create post
          </v-btn>
          <v-btn flat @click.stop="followDialog = true">
            <v-icon left dark>person_add</v-icon>
            Follow
          </v-btn>
          <v-btn flat @click.stop="logOutDialog = true">
            <v-icon left dark>exit_to_app</v-icon>
            Log out
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container style="margin-top: 3em; width: 88em; background-color: #FCFCFC; border-radius: 2em;">
					<v-row>
						<v-col>
                <div class="ml-4" style="width: 8em;">
								<button
                  @click="$router.replace({ name: 'Home' })"
                  flat
                  class="Fregular"
                  style="font-size: 25px"
                >
                  Followers
                </button>
                <button
                  @click="$router.replace({ name: 'Wall' })"
                  flat
                  class="Fregular mt-2"
                  style="font-size: 25px"
                >
                  Home
                </button>
								</div>
								</v-col>
								<v-col>
								<div>
              <router-view />
								</div>
								</v-col>
					</v-row>
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import gql from "graphql-tag";

export default {
  mounted() {
    this.checkAuthToken();
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  apollo: {
    getFollowableUsers: {
      query: gql`
        query getFollowableUsers {
          getFollowableUsers {
            username
            firstName
            lastName
          }
        }
      `,
      pollInterval: 60000,
      skip() {
        if (this.followDialog) return false;
        return true;
      },
    },
    getFollows: {
      query: gql`
        query getFollows {
          getFollows {
            username
            firstName
            lastName
          }
        }
      `,
      pollInterval: 60000,
      skip() {
        if (this.followDialog) return false;
        return true;
      },
    },
  },
  methods: {
    handleScroll(e) {
      if (e.pageY > 0) this.shadowOnToolbar = false;
      if (e.pageY <= 0) this.shadowOnToolbar = true;
    },
    checkAuthToken() {
      if (
        this.$store.getters.getAuthToken &&
        !this.$store.getters.getCurrentUser.username
      ) {
        this.$apollo
          .query({
            query: gql`
              query {
                getUserAssociatedWithToken {
                  firstName
                  lastName
                  username
                  email
                }
              }
            `,
          })
          .then((data) => {
            this.$store.dispatch(
              "addCurrentUser",
              data.data.getUserAssociatedWithToken
            );
          })
          .catch(() => {
            // TODO: Catch error.
          });
      }
    },
    createPost() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation createPost($title: String, $body: String!, $tags: String) {
              createPost(title: $title, body: $body, tags: $tags) {
                title
                body
                tags
                postId
              }
            }
          `,
          variables: {
            title: this.postTitle,
            body: this.postBody,
            tags: this.postTags.toString(),
          },
        })
        .then(() => {
          this.createPostDialog = false;
          this.postBody = null;
          this.postTitle = null;
          this.postTags = [];
        });
    },
    removeTag(item) {
      this.postTags.splice(this.postTags.indexOf(item), 1);
      this.postTags = [...this.postTags];
    },
    followUser(username) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation followUser($username: String!) {
              followUser(username: $username) {
                follow
              }
            }
          `,
          variables: {
            username,
          },
        })
        .then(() => {
          this.$apollo.queries.getFollowableUsers.refetch();
          this.$apollo.queries.getFollows.refetch();
        });
    },
    unfollowUser(username) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation unfollowUser($username: String!) {
              unfollowUser(username: $username) {
                follow
              }
            }
          `,
          variables: {
            username,
          },
        })
        .then(() => {
          this.$apollo.queries.getFollowableUsers.refetch();
          this.$apollo.queries.getFollows.refetch();
        });
    },
    logOut() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation logOut {
              logout {
                loggedOut
              }
            }
          `,
        })
        .then((data) => {
          if (data.data.logout.loggedOut) {
            this.$store.dispatch("logOut");
            this.$router.replace("/login");
          }
        });
    },
  },
  data() {
    return {
      shadowOnToolbar: true,
      createPostDialog: false,
      getFollowableUsers: [],
      getFollows: [],
      logOutDialog: false,
      followDialog: false,
      postBody: null,
      postTitle: null,
      postTags: [],
    };
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap");

.Flight {
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
}
.Fregular {
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
}
.FsemiBold {
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
}
.Fbold {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
}
</style>
