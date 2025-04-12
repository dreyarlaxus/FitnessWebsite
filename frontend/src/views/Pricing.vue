<template>
   <div class="pricing-page">
      <h1>Pricing Page</h1>
      <!-- Nếu người dùng chưa có VIP -->
      <button
         v-if="user && user.vip === 0"
         @click="upgradeVip"
         class="buy-service-btn"
      >
         Click to Buy Service
      </button>
      <!-- Nếu người dùng đã có VIP -->
      <button
         v-else-if="user && user.vip === 1"
         @click="navigateToService"
         class="go-to-service-btn"
      >
         Go to Service
      </button>
      <!-- Nếu chưa đăng nhập -->
      <p v-else>Please sign in to access our services.</p>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserService';
import { useCurrentUserStore } from '@/stores/currentUserStore';

interface UserDataFromStore {
   id: number;
   username: string;
   vip: number;
}
const router = useRouter();
const user = ref<UserDataFromStore | null>(null);
const currentUserStore = useCurrentUserStore();

async function upgradeVip() {
   try {
      if (!user.value || !user.value.username) {
         alert('User information is missing. Please log in again.');
         console.error('No username found in user data:', user.value);
         return;
      }

      const currentUser = currentUserStore.currentUser;
      console.log(currentUser);

      console.log('Attempting to update VIP status for user:', user.value.username);

      const result = await UserService.updateVip(user.value.id); // Gửi yêu cầu cập nhật VIP
      if (result.status === 200) {
         user.value = currentUserStore.currentUser as UserDataFromStore;
         user.value.vip = 1;
         currentUserStore.setCurrentUser(user.value);
      }
      user.value.vip = 1; // Cập nhật trạng thái VIP cục bộ
      alert('Congratulations! You are now a VIP member!');
   } catch (error) {
      console.error('Error upgrading VIP:', error);
      alert('Failed to upgrade. Please try again.');
   }
}

function navigateToService() {
   router.push('/service');
}

onMounted(() => {
   user.value = currentUserStore.currentUser;
   console.log('Fetched user data:', user.value);
});
</script>

<style scoped>
.pricing-page {
   text-align: center;
   padding: 20px;
   background-color: #1e1e2f;
   color: #ffffff;
}

.buy-service-btn,
.go-to-service-btn {
   margin-top: 20px;
   padding: 10px 20px;
   background-color: #4caf50;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   font-size: 1.2rem;
   transition: background-color 0.3s ease;
}

.buy-service-btn:hover,
.go-to-service-btn:hover {
   background-color: #45a049;
}
</style>
