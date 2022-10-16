import gql from 'graphql-tag'


// QUERY USER - PERMISSION //

export const findOneUserId = gql`
query ($user_id: String!){
  findOneUserId(user_id:$user_id){
    id,
    user_id,
    permission{
      id,
      user_id
    }
  }
}`;

// // MUTATION USER - PERMISSION //

export const createPermission = gql`
mutation(
          $user_id_owner: String!,
          $nameUser: String!
      ){
          createPermission(
            user_id_owner:$user_id_owner,
            nameUser:$nameUser
          ){
        id,
        user_id,
  }
}`;

export const removePermission = gql`
mutation(
          $user_id_owner: String!,
          $user_id: String!
        ){
            removePermission(
              user_id_owner:$user_id_owner,
              user_id:$user_id
            ){
          id,
          user_id,
  }
}`;

// MUTATION TWEET

export const removeTweet = gql`
mutation($id: Int!){
            removeTweet(id:$id)
            {
              id
              user_id
            }
}`;

export const createTweet = gql`
mutation(
          $tweet: String!,
          $scheduleTweet: DateTime!,
          $user_id_owner: String!,
          $user_id: String!
        ){
            createTweet(
              tweet:$tweet,
              scheduleTweet:$scheduleTweet,
              user_id_owner:$user_id_owner,
              user_id:$user_id
            ){
              id
              user_id
              scheduleTweet
              tweet
              user{
                id
                user_id
              }
  }
}`;

export const createTweet_2 = gql`
mutation(
          $tweet: String!,
          $scheduleTweet: DateTime!,
          $user_id: String!
        ){
            createTweet(
              tweet:$tweet,
              scheduleTweet:$scheduleTweet,
              user_id:$user_id
            ){
              id
              user_id
              scheduleTweet
              tweet
              user{
                id
                user_id
              }
  }
}`;

export const createTweet_gif = gql`
mutation(
          $tweet: String!,
          $scheduleTweet: DateTime!,
          $user_id: String!,
          $user_id_owner: String!,
          $gifLink: String!
        ){
            createTweetGif(
              tweet:$tweet,
              scheduleTweet:$scheduleTweet,
              user_id:$user_id,
              user_id_owner:$user_id_owner,
              gifLink:$gifLink
            ){
              id
              user_id
              scheduleTweet
              tweet
              user{
                id
                user_id
              }
  }
}`;

export const createTweet_media = gql`
mutation(
          $tweet: String!,
          $scheduleTweet: DateTime!,
          $user_id: String!,
          $user_id_owner: String!,
          $mediaLink: String!
        ){
            createTweetMedia(
              tweet:$tweet,
              scheduleTweet:$scheduleTweet,
              user_id:$user_id,
              user_id_owner:$user_id_owner,
              mediaLink:$mediaLink
            ){
              id
              user_id
              scheduleTweet
              tweet
              user{
                id
                user_id
              }
  }
}`;

export const createTweet_gif_2 = gql`
mutation(
          $tweet: String!,
          $scheduleTweet: DateTime!,
          $user_id: String!,
          $gifLink: String!
        ){
            createTweetGif(
              tweet:$tweet,
              scheduleTweet:$scheduleTweet,
              user_id:$user_id,
              gifLink:$gifLink
            ){
              id
              user_id
              scheduleTweet
              tweet
              user{
                id
                user_id
              }
  }
}`;

export const createTweet_media_2 = gql`
mutation(
          $tweet: String!,
          $scheduleTweet: DateTime!,
          $user_id: String!,
          $mediaLink: String!
        ){
            createTweetMedia(
              tweet:$tweet,
              scheduleTweet:$scheduleTweet,
              user_id:$user_id,
              mediaLink:$mediaLink
            ){
              id
              user_id
              scheduleTweet
              tweet
              user{
                id
                user_id
              }
  }
}`;

export const updateTweet = gql`
mutation(
          $id: Int!,
          $scheduleTweet: DateTime!,
          $tweet: String!
        ){
      updateTweet(id:$id , scheduleTweet:$scheduleTweet, tweet:$tweet)
      {
        id
        user_id
        tweet
        scheduleTweet
      }
}`;

export const updateTweet_gif = gql`
mutation(
          $id: Int!,
          $scheduleTweet: DateTime!,
          $tweet: String!
          $gifLink: String!
        ){
      updateTweet(id:$id , scheduleTweet:$scheduleTweet, tweet:$tweet, gifLink:$gifLink)
      {
        id
        user_id
        tweet
        scheduleTweet
      }
}`;

export const updateTweet_media = gql`
mutation(
          $id: Int!,
          $scheduleTweet: DateTime!,
          $tweet: String!
          $mediaLink: String!
        ){
      updateTweet(id:$id , scheduleTweet:$scheduleTweet, tweet:$tweet, mediaLink:$mediaLink)
      {
        id
        user_id
        tweet
        scheduleTweet
      }
}`;