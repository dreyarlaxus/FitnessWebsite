// import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/views/Home.vue';
// import Service from '@/views/Service.vue';
// import AboutUs from '@/views/AboutUs.vue';
// import Pricing from '@/views/Pricing.vue';
// import Review from '@/views/Review.vue';
// const routes = [
//    {
//       path: '/',
//       component: Home,
//       name: 'home-view'
//    },
//    {
//       path: '/service',
//       component: Service,
//       name: 'service-view'
//    },
//    {
//       path: '/about-us',
//       component: AboutUs,
//       name: 'aboutus-view'
//    },
//    {
//       path: '/pricing',
//       component: Pricing,
//       name: 'pricing-view'
//    },
//    {
//       path: '/review',
//       component: Review,
//       name: 'review-view'
//    }
// ];

// const router = createRouter({
//    history: createWebHistory(),
//    routes
// });

// export default router;
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Service from '@/views/Service.vue';
import AboutUs from '@/views/AboutUs.vue';
import Pricing from '@/views/Pricing.vue';
import Review from '@/views/Review.vue';
import Workouts from '@/views/Workouts.vue'; // Import Workouts page
import Meals from '@/views/Meals.vue'; // Import Meals page

const routes = [
   {
      path: '/',
      component: Home,
      name: 'home-view'
   },
   {
      path: '/service',
      component: Service,
      name: 'service-view'
   },
   {
      path: '/about-us',
      component: AboutUs,
      name: 'aboutus-view'
   },
   {
      path: '/pricing',
      component: Pricing,
      name: 'pricing-view'
   },
   {
      path: '/review',
      component: Review as any,
      name: 'review-view'
   },
   {
      path: '/workouts',
      component: Workouts,
      name: 'workouts-view'
   },
   {
      path: '/meals',
      component: Meals,
      name: 'meals-view'
   }
];

const router = createRouter({
   history: createWebHistory(),
   routes
});

export default router;
