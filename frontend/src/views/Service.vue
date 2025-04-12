<template>
   <div class="service-page">
      <!-- Phần hiển thị thẻ (card) Workouts và Meals -->
      <div class="grid grid-cols-2 gap-8">
         <!-- Card Workouts -->
         <Card class="card">
            <CardHeader>
               <CardTitle>Workouts</CardTitle>
               <CardDescription>{{ description_workout }}</CardDescription>
            </CardHeader>
            <img
               class="card-image"
               src="@/assets/photos/R.jpg"
               alt="Workout Image"
            />
            <CardContent>
               <p>Difficulty: {{ workout.difficulty }}</p>
               <p>Burn Estimate: {{ workout.burn_estimate }} kcal</p>
            </CardContent>
            <CardFooter class="card-footer">
               <button
                  v-if="user && user.vip === 1"
                  @click="navigateToPage('workout')"
                  class="btn-primary"
               >
                  Let's do it
               </button>
               <button
                  v-else
                  @click="navigateToPricing"
                  class="btn-secondary"
               >
                  Buy Service
               </button>
            </CardFooter>
         </Card>

         <!-- Card Meals -->
         <Card class="card">
            <CardHeader>
               <CardTitle>Meals</CardTitle>
               <CardDescription>{{ description_meal }}</CardDescription>
            </CardHeader>
            <img
               class="card-image"
               src="@/assets/photos/honey-lime-shrimp-3-625x781.jpg"
               alt="Meal Image"
            />
            <CardContent>
               <p>Calories: {{ meal.calories }} kcal</p>
               <p>Meal Type: {{ meal.meal_type }}</p>
            </CardContent>
            <CardFooter class="card-footer">
               <button
                  v-if="user && user.vip === 1"
                  @click="navigateToPage('meal')"
                  class="btn-primary"
               >
                  Let's do it
               </button>
               <button
                  v-else
                  @click="navigateToPricing"
                  class="btn-secondary"
               >
                  Buy Service
               </button>
            </CardFooter>
         </Card>
      </div>

      <!-- Lazy loading thông tin bổ sung -->
      <div
         ref="additionalInfo"
         class="additional-info"
         :class="{ visible: showAdditionalInfo }"
      >
         <h3>Discover More About Our Services</h3>
         <p>
            We provide a variety of programs to cater to your fitness and dietary needs. Our
            comprehensive approach ensures that you stay on track and reach your physique goals.
         </p>
         <ul>
            <li>Customized workout plans tailored for each individual</li>
            <li>Nutritionist-approved meal plans</li>
            <li>24/7 customer support and consultation</li>
         </ul>
      </div>

      <div
         ref="moreInfo"
         class="more-info"
         :class="{ visible: showMoreInfo }"
      >
         <h3>Join Our Community</h3>
         <p>
            Becoming a part of our fitness family means constant motivation and support from peers
            who share your passion.
         </p>
         <ul>
            <li>Exclusive member events</li>
            <li>Access to online resources and webinars</li>
            <li>Personalized fitness consultations</li>
         </ul>
      </div>

      <!-- Lazy loading phần mới -->
      <div
         ref="extraInfo"
         class="extra-info"
         :class="{ visible: showExtraInfo }"
      >
         <h3>Why Choose Us?</h3>
         <p>
            Our fitness programs are designed with one goal in mind: to help you become the best
            version of yourself.
         </p>
         <ul>
            <li>Flexible workout schedules to suit your lifestyle</li>
            <li>Holistic approach to fitness and wellness</li>
            <li>Continuous updates and improvements to our plans</li>
         </ul>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle
} from '@/components/ui/card';
// import UserService from '@/services/UserService';
import { useCurrentUserStore } from '@/stores/currentUserStore';

interface UserDataFromStore {
   id: number;
   username: string;
   vip: number;
}

const router = useRouter();
const user = ref<UserDataFromStore | null>(null);
const currentUserStore = useCurrentUserStore();

// const image_workout = '/src/assets/photos/R.jpg';
const description_workout = 'We will supply to you too much videos about fitness guide.';
const workout = {
   difficulty: 'About your efforts',
   burn_estimate: 'Depending on your training time.'
};

// const image_meal = '/src/assets/photos/honey-lime-shrimp-3-625x781.jpg';
const description_meal = 'Advise you how to eat clean.';
const meal = {
   calories: 'Depending on your stamina',
   meal_type: 'Clean.'
};

const showAdditionalInfo = ref(false);
const showMoreInfo = ref(false);
const showExtraInfo = ref(false); // State mới cho lazy loading

function navigateToPage(page: string) {
   if (page === 'workout') router.push('/workouts');
   else if (page === 'meal') router.push('/meals');
}

function navigateToPricing() {
   router.push('/pricing'); // Điều hướng tới trang Pricing
}

function observeElement(element: any, callback: any) {
   const observer = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               callback();
               observer.disconnect();
            }
         });
      },
      { threshold: 0.5 }
   );
   observer.observe(element);
}

onMounted(async () => {
   // loadUser(); // Load user thông tin
   user.value = currentUserStore.currentUser;
   const additionalInfoElement = document.querySelector('.additional-info');
   const moreInfoElement = document.querySelector('.more-info');
   const extraInfoElement = document.querySelector('.extra-info'); // Thêm quan sát cho phần mới

   if (additionalInfoElement) {
      observeElement(additionalInfoElement, () => {
         showAdditionalInfo.value = true;
      });
   }

   if (moreInfoElement) {
      observeElement(moreInfoElement, () => {
         showMoreInfo.value = true;
      });
   }

   if (extraInfoElement) {
      observeElement(extraInfoElement, () => {
         showExtraInfo.value = true;
      });
   }
});
</script>

<style scoped>
.service-page {
   background-color: #1e1e2f;
   color: #ffffff;
   padding: 20px;
   min-height: 150vh;
}

/* Card Styles */
.card {
   background-color: #2a2a40;
   border-radius: 10px;
   box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
   padding: 20px;
   color: #d1d5db;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   max-width: 100%;
   height: auto;
}

.card:hover {
   transform: translateY(-5px);
   box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

.card-image {
   width: 100%;
   height: 150px;
   object-fit: cover;
   margin-bottom: 20px;
}

.card-footer {
   display: flex;
   justify-content: flex-end;
   align-items: center;
   margin-top: auto;
}

.btn-primary {
   background-color: #4c8bf5;
   color: #fff;
   padding: 10px 20px;
   border-radius: 6px;
   border: none;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.btn-primary:hover {
   background-color: #367bf4;
}

.btn-secondary {
   background-color: #ff9800;
   color: white;
   padding: 10px 20px;
   border-radius: 6px;
   border: none;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.btn-secondary:hover {
   background-color: #fb8c00;
}

/* Lazy loading styles */
.additional-info,
.more-info,
.extra-info {
   margin-top: 40px;
   padding: 20px;
   background-color: #2a2a40;
   border-radius: 10px;
   color: #d1d5db;
   opacity: 0;
   transform: translateY(20px);
   transition: opacity 0.5s ease, transform 0.5s ease;
}

.additional-info.visible,
.more-info.visible,
.extra-info.visible {
   opacity: 1;
   transform: translateY(0);
}

h3 {
   font-size: 1.8rem;
   margin-bottom: 10px;
}

p,
ul {
   font-size: 1.1rem;
   line-height: 1.5;
}

ul li {
   margin-bottom: 10px;
}
</style>
