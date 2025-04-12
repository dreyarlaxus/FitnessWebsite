<!-- <template>
   <NavigationMenu
      class="fixed z-10 top-0 left-0 right-0 w-full max-w-full px-4 py-8 justify-between bg-primary"
   >
      <RouterLink
         :to="{
            name: 'home-view'
         }"
      >
         <div class="logo text-white text-[1.5rem] font-bold">
            Royal <span class="text-main-green">Fitness</span>
         </div>
      </RouterLink>

      <NavigationMenuList class="">
         <NavigationMenuItem v-for="route in routes">
            <NavigationMenuLink
               :as="RouterLink"
               :to="{ name: route.direct }"
               class="text-base text-white font-[500] px-4 py-2 hover:text-main-green"
               >{{ route.title }}</NavigationMenuLink
            >
         </NavigationMenuItem>
      </NavigationMenuList>

      <Button
         class="join-button border-main-border bg-transparent text-base text-main-green hover:bg-main-green font-[600]"
         variant="outline"
         @click="isSignupDialogOpen = true"
         >Join Us</Button
      >
   </NavigationMenu>

   <Dialog
      :open="isSignupDialogOpen"
      @update:open="isSignupDialogOpen = false"
   >
      <DialogContent class="sm:max-w-[425px]">
         <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>Please fill out your information!!!</DialogDescription>
         </DialogHeader>

         <SignupForm ref="callSubmitSignup"></SignupForm>

         <DialogFooter style="justify-content: space-between">
            <Button
               variant="link"
               @click="(isSigninDialogOpen = true), (isSignupDialogOpen = false)"
               class="px-0"
               >You have an account???</Button
            >
            <Button
               type="submit"
               @click="submitSignup"
            >
               Submit
            </Button>
         </DialogFooter>
      </DialogContent>
   </Dialog>

   <Dialog
      :open="isSigninDialogOpen"
      @update:open="isSigninDialogOpen = false"
   >
      <DialogContent class="sm:max-w-[425px]">
         <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>Please fill out your information!!!</DialogDescription>
         </DialogHeader>

         <SigninForm ref="callSubmitSignin"></SigninForm>

         <DialogFooter style="justify-content: space-between">
            <Button
               variant="link"
               @click="(isSignupDialogOpen = true), (isSigninDialogOpen = false)"
               class="px-0"
               >You don't have account?</Button
            >
            <Button
               type="submit"
               @click="submitSignin"
            >
               Submit
            </Button>
         </DialogFooter>
      </DialogContent>
   </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
   NavigationMenu,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList
} from '@/components/ui/navigation-menu';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from '@/components/ui/dialog';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import SigninForm from '@/components/SigninForm.vue';
import SignupForm from '@/components/SignupForm.vue';

const routes: { title: string; direct: string }[] = [
   {
      title: 'Home',
      direct: 'home-view'
   },
   {
      title: 'Services',
      direct: 'service-view'
   },
   {
      title: 'About Us',
      direct: 'aboutus-view'
   },
   {
      title: 'Pricing',
      direct: 'pricing-view'
   },
   {
      title: 'Review',
      direct: 'review-view'
   }
];

const isSignupDialogOpen = ref(false);
const isSigninDialogOpen = ref(false);
const callSubmitSignup = ref(null);
const callSubmitSignin = ref(null);

const submitSignup = () => {
   callSubmitSignup.value.onSubmit();
};

const submitSignin = () => {
   callSubmitSignin.value.onSubmit();
};
</script>

<style scoped></style> -->
<template>
   <NavigationMenu
      class="fixed z-10 top-0 left-0 right-0 w-full max-w-full px-4 py-8 justify-between bg-primary"
   >
      <RouterLink
         :to="{
            name: 'home-view'
         }"
      >
         <div class="logo text-white text-[1.5rem] font-bold">
            Royal <span class="text-main-green">Fitness</span>
         </div>
      </RouterLink>

      <NavigationMenuList class="">
         <!-- Loop qua các route để render navigation -->
         <NavigationMenuItem
            v-for="route in routes"
            :key="route.title"
         >
            <NavigationMenuLink
               :as="RouterLink"
               :to="{ name: route.direct }"
               class="text-base text-white font-[500] px-4 py-2 hover:text-main-green"
            >
               {{ route.title }}
            </NavigationMenuLink>
         </NavigationMenuItem>
      </NavigationMenuList>

      <!-- Nút Logout nếu đã đăng nhập -->
      <Button
         v-if="isLoggedIn"
         class="logout-button border-main-border bg-transparent text-base text-red-500 hover:bg-red-500 hover:text-white font-[600]"
         variant="outline"
         @click="handleLogout"
      >
         Logout
      </Button>

      <!-- Nút Join Us nếu chưa đăng nhập -->
      <Button
         v-if="!isLoggedIn"
         class="join-button border-main-border bg-transparent text-base text-main-green hover:bg-main-green font-[600]"
         variant="outline"
         @click="isSignupDialogOpen = true"
      >
         Join Us
      </Button>
   </NavigationMenu>

   <Dialog
      :open="isSignupDialogOpen"
      @update:open="isSignupDialogOpen = false"
   >
      <DialogContent class="sm:max-w-[425px]">
         <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>Please fill out your information!!!</DialogDescription>
         </DialogHeader>

         <SignupForm ref="callSubmitSignup"></SignupForm>

         <DialogFooter style="justify-content: space-between">
            <Button
               variant="link"
               @click="(isSigninDialogOpen = true), (isSignupDialogOpen = false)"
               class="px-0"
            >
               You have an account???
            </Button>
            <Button
               type="submit"
               @click="submitSignup"
            >
               Submit
            </Button>
         </DialogFooter>
      </DialogContent>
   </Dialog>

   <Dialog
      :open="isSigninDialogOpen"
      @update:open="isSigninDialogOpen = false"
   >
      <DialogContent class="sm:max-w-[425px]">
         <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>Please fill out your information!!!</DialogDescription>
         </DialogHeader>

         <SigninForm
            ref="callSubmitSignin"
            @success="handleLoginSuccess"
         />

         <DialogFooter style="justify-content: space-between">
            <Button
               variant="link"
               @click="(isSignupDialogOpen = true), (isSigninDialogOpen = false)"
               class="px-0"
            >
               You don't have account?
            </Button>
            <Button
               type="submit"
               @click="submitSignin"
            >
               Submit
            </Button>
         </DialogFooter>
      </DialogContent>
   </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
   NavigationMenu,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList
} from '@/components/ui/navigation-menu';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from '@/components/ui/dialog';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import SigninForm from '@/components/SigninForm.vue';
import SignupForm from '@/components/SignupForm.vue';
import UserService from '@/services/UserService';
import { useCurrentUserStore } from '@/stores/currentUserStore';

// Cấu hình các route từ file cấu hình
const routes = [
   { title: 'Home', direct: 'home-view' },
   { title: 'Services', direct: 'service-view' },
   { title: 'About Us', direct: 'aboutus-view' },
   { title: 'Pricing', direct: 'pricing-view' },
   { title: 'Review', direct: 'review-view' }
];

const router = useRouter();
const isSignupDialogOpen = ref(false);
const isSigninDialogOpen = ref(false);
const isLoggedIn = ref(false);
const callSubmitSignup = ref<InstanceType<typeof SignupForm> | null>(null);
const callSubmitSignin = ref<InstanceType<typeof SigninForm> | null>(null);
const currentUserStore = useCurrentUserStore();
// Kiểm tra trạng thái đăng nhập khi khởi động
const checkLoginStatus = async () => {
   // try {
   //    const response = await UserService.getLoginStatus();
   //    isLoggedIn.value = response?.data?.loggedIn || false;
   // } catch {
   //    isLoggedIn.value = false;
   // }
   try {
      const currentUser = currentUserStore.currentUser;
      if (currentUser) {
         isLoggedIn.value = true;
      } else isLoggedIn.value = false;
   } catch (error) {
      console.log(error);
   }
};

const submitSignup = () => {
   if (callSubmitSignup.value) {
      callSubmitSignup.value.onSubmit();
   }
};

const submitSignin = () => {
   if (callSubmitSignin.value) {
      callSubmitSignin.value.onSubmit();
   }
};

const handleLoginSuccess = () => {
   isLoggedIn.value = true;
   isSigninDialogOpen.value = false;
   router.push({ name: 'home-view' });
};

const handleLogout = async () => {
   const confirmed = confirm('Are you sure you want to log out?');
   if (confirmed) {
      try {
         await UserService.logout();
         currentUserStore.clearUser();
         isLoggedIn.value = false;

         router.push({ name: 'home-view' });
      } catch (error) {
         console.error('Logout failed:', error);
      }
   }
};

// Gọi kiểm tra trạng thái khi khởi động
checkLoginStatus();
</script>

<style scoped></style>
