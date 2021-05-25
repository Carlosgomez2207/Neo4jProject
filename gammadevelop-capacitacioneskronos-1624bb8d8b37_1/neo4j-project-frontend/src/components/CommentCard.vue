<template>
  <v-card>
    <v-card-title class="Fbold" color="#5B5B5B"><b>{{ getAuthorOfComment.username }}</b></v-card-title>
    <v-card-text class="Fregular" style="color: #074553">{{ body }}</v-card-text>
  </v-card>
</template>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      getAuthorOfComment: '',
    };
  },
  props: {
    body: String,
    commentId: String,
  },
  apollo: {
    getAuthorOfComment: {
      query: gql`
        query getAuthorOfComment ($commentId: String!) {
          getAuthorOfComment(commentId: $commentId) {
            username
          }
        }
      `,
      variables() {
        return {
          commentId: this.commentId,
        }
      },
    }
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

