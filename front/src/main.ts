import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import authHeader from './services/auth-header'

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_BACKEND_URL + '/graphql',
    headers: authHeader(),
  })

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})  

const pinia = createPinia()

const app = createApp({
  setup()  {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})
app.use(router).use(pinia).mount('#app')