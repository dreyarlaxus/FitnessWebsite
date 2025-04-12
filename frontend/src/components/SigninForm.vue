<template>
   <form @submit.prevent="onSubmit">
      <FormField
         v-slot="{ componentField }"
         name="username"
      >
         <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
               <Input
                  type="text"
                  v-bind="componentField"
                  id="username"
                  class="col-span-3 border border-main-border p-1 rounded"
               />
            </FormControl>
            <FormMessage />
         </FormItem>
      </FormField>

      <FormField
         v-slot="{ componentField }"
         name="password"
      >
         <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
               <Input
                  type="password"
                  v-bind="componentField"
                  id="password"
                  placeholder="Enter your password"
                  class="col-span-3 border border-main-border p-1 rounded"
               />
            </FormControl>
            <FormMessage />
         </FormItem>
      </FormField>

      <button
         type="submit"
         class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
         Sign In
      </button>
   </form>
</template>

<script setup lang="ts">
import { Input } from './ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { defineExpose, defineEmits } from 'vue';
import { useForm } from 'vee-validate';
import UserService from '@/services/UserService';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCurrentUserStore } from '@/stores/currentUserStore';

const currentUserStore = useCurrentUserStore();

const emit = defineEmits(['success']);

const formSchema = toTypedSchema(
   z.object({
      username: z.string().min(2).max(50),
      password: z.string().min(8).max(20)
   })
);

const { handleSubmit } = useForm({
   validationSchema: formSchema
});

const onSubmit = handleSubmit(async (values) => {
   try {
      const response = await UserService.login(values);
      if (response?.data?.data?.user) {
         currentUserStore.setCurrentUser(response.data.data.user);
      }
      console.log('Login successful:', response);

      alert('Login successful!');
      emit('success'); // Emit sự kiện đăng nhập thành công
   } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to log in. Please check your credentials.');
   }
});

defineExpose({
   onSubmit
});
</script>

<style scoped></style>
