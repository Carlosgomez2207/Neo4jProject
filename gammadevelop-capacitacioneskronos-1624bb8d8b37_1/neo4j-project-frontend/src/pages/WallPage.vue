<template>
  <div style="background-color: #FCFCFC;">
    <br />
    <br />
    <template v-for="x in getAllPosts">
      <PostCard :postId="x.postId" :key="x.postId" :title="x.title" :body="x.body" style="margin: auto 25% auto 25%;" />
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
      getAllPosts: '',
    };
  },
  components: {
    PostCard,
  },
  apollo: {
    getAllPosts: {
      query: gql`
        query getAllPosts {
          getAllPosts {
            postId
            title
            body
            tags
          }
        }
      `,
      pollInterval: 60000,
      fetchPolicy: 'cache-and-network',
    }
  },
};
</script>
