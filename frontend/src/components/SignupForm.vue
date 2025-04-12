<template>
   <form @submit.prevent="onSubmit">
      <FormField
         v-slot="{ componentField }"
         name="fullname"
      >
         <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
               <Input
                  type="text"
                  v-bind="componentField"
                  id="fullname"
                  class="col-span-3 border border-main-border p-1 rounded"
               />
            </FormControl>
            <FormMessage />
         </FormItem>
      </FormField>

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
                  class="col-span-3 border border-main-border p-1 rounded"
               />
            </FormControl>
            <FormMessage />
         </FormItem>
      </FormField>

      <FormField
         v-slot="{ componentField }"
         name="phone"
      >
         <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
               <Input
                  type="text"
                  v-bind="componentField"
                  id="phone"
                  class="col-span-3 border border-main-border p-1 rounded"
               />
            </FormControl>
            <FormMessage />
         </FormItem>
      </FormField>

      <FormField
         v-slot="{ componentField }"
         name="email"
      >
         <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
               <Input
                  type="email"
                  v-bind="componentField"
                  id="email"
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
         Submit
      </button>
   </form>
</template>

<script setup lang="ts">
import { Input } from './ui/input';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { defineExpose } from 'vue';
import { useForm } from 'vee-validate';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import UserService from '@/services/UserService';

const formSchema = toTypedSchema(
   z.object({
      fullname: z.string().min(2).max(50),
      username: z.string().min(2).max(50),
      password: z.string().min(8).max(20),
      phone: z.string().min(10).max(11),
      email: z.string().email()
   })
);

const { handleSubmit } = useForm({
   validationSchema: formSchema
});

const onSubmit = handleSubmit(async (values) => {
   try {
      const response = await UserService.register(values);
      console.log('User registered successfully:', response);
      alert('Registration successful!');
   } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register. Please try again.');
   }
});

defineExpose({
   onSubmit
});
</script>

<style scoped></style>
