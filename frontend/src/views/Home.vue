<template>
   <div
      id="app"
      class="container w-full bg-primary"
   >
      <section class="hero">
         <div class="hero-text">
            <h1 class="font-bold">
               Build Your <br />
               Dream Physique
            </h1>
            <p>In America there is Diddy, in Vietnam there is his twin brother, Dinh Thong Chau.</p>
         </div>
         <div class="hero-image">
            <img
               src="@/assets/photos/fitness-guy.png"
               alt="Fitness Guy"
            />
         </div>
      </section>

      <!-- Phần chi tiết hơn xuất hiện sau khi cuộn -->
      <div
         ref="moreInfo1"
         class="more-info"
         :class="{ visible: showMoreInfo1 }"
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

      <!-- Phần chi tiết hơn thứ hai -->
      <div
         ref="moreInfo2"
         class="more-info"
         :class="{ visible: showMoreInfo2 }"
      >
         <h3>Our Mission and Vision</h3>
         <p>
            We aim to empower every individual to achieve their fitness goals with our innovative
            training programs and supportive community.
         </p>
         <ul>
            <li>State-of-the-art gym equipment</li>
            <li>Experienced trainers and coaches</li>
            <li>Inclusive and welcoming environment</li>
         </ul>
      </div>

      <!-- Phần chi tiết hơn thứ ba -->
      <div
         ref="moreInfo3"
         class="more-info"
         :class="{ visible: showMoreInfo3 }"
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
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const showMoreInfo1 = ref(false);
const showMoreInfo2 = ref(false);
const showMoreInfo3 = ref(false);

// Hàm sử dụng Intersection Observer để quan sát phần tử
function observeElement(element: any, callback: any) {
   const observer = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               callback();
               observer.disconnect(); // Ngắt quan sát sau khi đã hiện lên
            }
         });
      },
      { threshold: 0.5 } // Đảm bảo phần tử được cuộn vào ít nhất 50% chiều cao
   );
   observer.observe(element);
}

// Gọi hàm onMounted để quan sát phần tử khi trang được tải
onMounted(() => {
   const moreInfoElements = [
      {
         element: document.querySelector('.more-info:nth-of-type(1)'),
         callback: () => (showMoreInfo1.value = true)
      },
      {
         element: document.querySelector('.more-info:nth-of-type(2)'),
         callback: () => (showMoreInfo2.value = true)
      },
      {
         element: document.querySelector('.more-info:nth-of-type(3)'),
         callback: () => (showMoreInfo3.value = true)
      }
   ];

   moreInfoElements.forEach(({ element, callback }) => {
      if (element) {
         observeElement(element, callback);
      }
   });
});
</script>

<style scoped>
.container {
   width: 100%;
   min-height: 100vh;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
}

/* Hero Section */
.hero {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0 2rem;
   height: calc(100vh - 80px); /* Đảm bảo chiều cao vừa đủ để cuộn */
}

.hero-text {
   max-width: 50%;
}

.hero-text h1 {
   font-size: 3rem;
   color: white;
}

.hero-text p {
   color: white;
   margin: 1rem 0;
   line-height: 1.6;
}

.hero-image img {
   max-width: 100%;
   height: auto;
}

/* Phần chi tiết hơn */
.more-info {
   margin-top: 50px; /* Giữ khoảng cách lớn hơn để đảm bảo không kích hoạt sớm */
   padding: 20px;
   background-color: #2a2a40;
   border-radius: 10px;
   color: #d1d5db;
   opacity: 0;
   transform: translateY(20px);
   transition: opacity 0.5s ease, transform 0.5s ease;
}

.more-info.visible {
   opacity: 1;
   transform: translateY(0);
}

.more-info h3 {
   font-size: 1.8rem;
   margin-bottom: 10px;
   margin-bottom: 10px;
}

.more-info p,
.more-info ul {
   font-size: 1.1rem;
   line-height: 1.5;
}

.more-info ul li {
   margin-bottom: 10px;
}
</style>
