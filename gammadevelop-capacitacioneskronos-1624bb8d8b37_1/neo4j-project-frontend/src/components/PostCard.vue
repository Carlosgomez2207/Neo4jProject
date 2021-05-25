<template>
  <div>
    <v-dialog v-model="createCommentDialog" max-width="35vw" scrollable>
      <v-card class="pt-2" style="word-wrap: break-word; border-radius: 1em;">
        <v-card-title
          ><h1 class="Fregular ml-2">Create comment for:</h1></v-card-title
        >
        <v-card-text>
          <v-card
					flat
					color="#c4c4c420"
					style="width: 33em; border-radius: 1em; margin-left: 6em"
					>
            <v-card-title
              ><h1 class="Fbold">{{ title }}</h1></v-card-title
            >
            <v-card-text
						class="FsemiBold"
						>{{ body }}</v-card-text>
          </v-card>
          <v-text-field
            hide-details
            solo
						flat
            background-color="#c4c4c420"
						class="mt-5"
            label="Comment"
						style="width: 28.5em; margin-left: 5.5em"
            v-model="commentBody"
          />
        </v-card-text>
        <v-card-actions class="pb-5 mt-2">
          <v-btn
            :disabled="
              commentBody === null || commentBody === '' ? true : false
            "
            color="#0D78B4"
						style="width:32.4em; margin-left: 7em"
            @click="createComment"
            ><h4 class="Fregular" style="color: white">Submit comment</h4></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card elevation="4" class="postCards">
      <v-card-title>
         <v-avatar
						size="36px"
					><img src="@/assets/foto.jpg" /></v-avatar>
					<h3 class="ml-3 Fregular"> {{ $store.getters.getCurrentUser.username }} </h3>
      </v-card-title>
			<div class="ml-3">
      <v-card-text>
				<h1 class="mb-3 Fbold">{{ title }}</h1>
        <span class="FsemiBold">{{ body }}</span>
      </v-card-text>
      <v-card-actions>
        <v-btn class="Fregular" flat color="#005B70" small @click.stop="createCommentDialog = true"
          >Comment</v-btn
        >
        <v-btn class="Fregular" flat color="#005B70" small @click="toggleComments"
          >Toggle comments</v-btn
        >
      </v-card-actions>
			</div>
      <v-card-text
        style="text-align: center; padding-bottom: 0;"
        v-show="getCommentsFromPost.length < 1 && loadComments"
      >
        <b class="Fbold">No comments.</b>
      </v-card-text>
      <v-card-text v-show="loadComments">
        <template v-for="x in getCommentsFromPost">
          <CommentCard
            :key="x.commentId"
            :body="x.body"
            :commentId="x.commentId"
          />
          <br :key="x.index" />
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";

import CommentCard from "./CommentCard";

export default {
  name: "PostCard",
  props: {
    postId: String,
    title: String,
    body: String,
    tags: Array,
  },
  data() {
    return {
      loadComments: false,
      getCommentsFromPost: [],
      createCommentDialog: false,
      commentBody: null,
    };
  },
  apollo: {
    getCommentsFromPost: {
      query: gql`
        query getCommentsFromPost($postId: String!) {
          getCommentsFromPost(postId: $postId) {
            commentId
            body
          }
        }
      `,
      variables() {
        return {
          postId: this.postId,
        };
      },
      pollInterval: 3000,
      skip() {
        if (this.loadComments) return false;
        return true;
      },
      fetchPolicy: "cache-and-network",
    },
  },
  methods: {
    createComment() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($postId: String!, $body: String!) {
              createComment(postId: $postId, body: $body) {
                commentId
                body
              }
            }
          `,
          variables: {
            postId: this.postId,
            body: this.commentBody,
          },
        })
        .then(() => {
          this.createCommentDialog = false;
          this.commentBody = null;
        });
    },
    fetchComments() {
      this.$apollo
        .query({})
        .then((data) => {
          this.getCommentsFromPost = data.data.getCommentsFromPost;
        })
        .catch(() => {});
    },
    toggleComments() {
      if (this.loadComments) {
        this.loadComments = false;
      } else {
        this.loadComments = true;
      }
    },
  },
  components: {
    CommentCard,
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
</style>
