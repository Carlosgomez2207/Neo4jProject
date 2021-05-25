<template>
  <div style="background-color: #FCFCFC;">
    <br />
    <br />
    <template v-for="x in getPostsFromFollowings">
      <PostCard :postId="x.postId" :title="x.title" :body="x.body" style="margin: auto 25% auto 25%;" />
      <br :key="x.index" />
    </template>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import PostCard from '../components/PostCard';

export default {
  data() {
    return {
      getPostsFromFollowings: '',
    };
  },
  components: {
    PostCard,
  },
  apollo: {
    getPostsFromFollowings: {
      query: gql`
        query postsFromFollowings {
          getPostsFromFollowings {
            postId
            title
            body
            tags
          }
        }
      `,
      pollInterval: 30000,
      fetchPolicy: 'cache-and-network',
    }
  },
};
</script>
