<template>
   <div class="about-us-page">
      <!-- Image Section -->
      <section class="image-section">
         <img
            src="@/assets/photos/z5997943762133_55b3a627f9158bfd9dc623a0127e876b.jpg"
            alt="Image 1"
            class="about-us-image"
         />
         <img
            src="@/assets/photos/z5997943766718_1c17cdc63c8ce8fa15991da64d65dcb0.jpg"
            alt="Image 2"
            class="about-us-image"
         />
      </section>

      <!-- Detailed Information Section -->
      <section
         ref="infoSection"
         class="info-section"
      >
         <div
            class="info-container"
            v-for="(info, index) in infos"
            :key="index"
            :class="{ visible: showInfo[index] }"
         >
            <h2>{{ info.title }}</h2>
            <div v-html="info.description"></div>
         </div>
      </section>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// const images = [
//    'z5997943762133_55b3a627f9158bfd9dc623a0127e876b.jpg',
//    'z5997943766718_1c17cdc63c8ce8fa15991da64d65dcb0.jpg'
// ];

const infos = [
   {
      title: 'Nguyen Phu Thinh',
      description: `
         <ul class="description-list">
            <li><strong>Full Name:</strong> Nguyen Phu Thinh</li>
            <li><strong>Date of Birth:</strong> 11/13/2003</li>
            <li><strong>Gender:</strong> Male</li>
            <li><strong>Zodiac Sign:</strong> Scorpio</li>
            <li><strong>Hobbies:</strong> Listening to music, gaming, learning web development from Teacher Bao, badminton, and gym with the guy on the right</li>
         </ul>
         <p class="thoughts"><strong>Thoughts:</strong> I believe that working out at the gym is truly an effective way to improve health. I've been going to the gym for a year, and I think we all need to stay committed to exercise to achieve the health and body we desire. This is one of the main reasons why the two of us created this website – for gym enthusiasts to share experiences, learn from one another, and enjoy the benefit of our curated workout and meal plans that help support everyone’s fitness journey. Let’s keep grinding!</p>
      `
   },
   {
      title: 'Cao Tien Anh',
      description: `
         <ul class="description-list">
            <li><strong>Full Name:</strong> Cao Tien Anh</li>
            <li><strong>Date of Birth:</strong> 20/09/2003</li>
            <li><strong>Gender:</strong> Male</li>
            <li><strong>Zodiac Sign:</strong> Virgo</li>
            <li><strong>Hobbies:</strong> Football, Badminton, Gym, Code, and Music</li>
         </ul>
         <p class="thoughts"><strong>Thoughts:</strong>...................</p>
      `
   }
];

const showInfo = ref([false, false]);

function observeElements() {
   const infoElements = document.querySelectorAll('.info-container');
   infoElements.forEach((element, index) => {
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  showInfo.value[index] = true;
                  observer.disconnect();
               }
            });
         },
         { threshold: 0.5 }
      );
      observer.observe(element);
   });
}

onMounted(() => {
   observeElements();
});
</script>

<style scoped>
.about-us-page {
   padding: 40px;
   background-color: #1e1e2f;
   color: #ffffff;
   min-height: 100vh;
   display: flex;
   flex-direction: column;
   align-items: center;
}

.image-section {
   display: flex;
   justify-content: space-around;
   gap: 30px;
   margin-bottom: 20px;
   width: 100%;
}

.about-us-image {
   width: 45%;
   height: auto;
   border-radius: 10px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
   object-fit: cover;
}

.info-section {
   display: flex;
   justify-content: space-around;
   gap: 30px;
   width: 100%;
   margin-top: 20px;
}

.info-container {
   background-color: #2a2a40;
   padding: 20px;
   border-radius: 10px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
   opacity: 0;
   transform: translateY(20px);
   transition: opacity 0.5s ease, transform 0.5s ease;
   flex: 1;
   max-width: 35%;
}

.info-container.visible {
   opacity: 1;
   transform: translateY(0);
}

.info-container h2 {
   font-size: 32px;
   font-weight: 700;
   background: linear-gradient(135deg, #61dafb, #4caf50);
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
   margin-bottom: 15px;
   text-align: center;
   position: relative;
   padding: 5px 0;
}

.info-container h2::before,
.info-container h2::after {
   content: '';
   position: absolute;
   height: 2px;
   width: 40px;
   background-color: #4caf50;
   top: 50%;
   transform: translateY(-50%);
}

.info-container h2::before {
   left: -50px;
}

.info-container h2::after {
   right: -50px;
}

.description-list {
   list-style: none;
   padding: 0;
}

.description-list li {
   margin-bottom: 10px;
   font-size: 1.1rem;
   color: #b2ebf2;
   border-left: 3px solid #4caf50;
   padding-left: 10px;
}

.thoughts {
   margin-top: 15px;
   font-size: 1rem;
   line-height: 1.6;
   color: #d1d5db;
   border-top: 1px dashed #61dafb;
   padding-top: 15px;
   text-align: justify;
}

.description-placeholder {
   color: #b2ebf2;
   font-style: italic;
   font-size: 1.1rem;
   padding: 10px;
}
</style>
