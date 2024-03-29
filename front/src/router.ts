import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from "vue-router";
import Home from './views/Home.vue'
import Profile from './views/Profile.vue'
import Tweet from './views/Tweet.vue'
import Permission from './views/Permission.vue'
import test_views from './views/test_views.vue'
import tweet_test from './views/tweet_test.vue'

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/tweet',
      name: 'Tweet',
      component: Tweet
    },
    {
      path: '/permission',
      name: 'Permission',
      component: Permission
    },
    {
      path: '/test',
      name: 'test',
      component: test_views
    },
    {
      path: '/tweet_test',
      name: 'tweet_test',
      component: tweet_test
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: "/",
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
	let storedUser = localStorage.getItem('user')
	let user = {}
	if (!storedUser)
	{
		if (to.name !== 'Home')
			return {name: 'Home'}
	}
})

export default router
