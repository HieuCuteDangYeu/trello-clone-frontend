<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Start Learning</CardTitle>
        <CardDescription class="text-center">
          Create an account to build your own vocabulary decks
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="johndoe" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <span v-if="isSubmitting">Creating Account...</span>
            <span v-else>Sign Up</span>
          </Button>
        </form>

        <div class="mt-4 text-center text-sm">
          Already have an account?
          <RouterLink to="/login" class="underline text-primary">
            Login
          </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';
import { getErrorMessage } from '@/utils/error';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();
const authStore = useAuthStore();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(registerSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.register({
      email: values.email,
      username: values.username,
      password: values.password,
    });

    toast.success('Account created successfully!', {
      description: 'Please check your email to verify your account before logging in.',
      duration: 5000,
    });

    resetForm();

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err: unknown) {
    toast.error('Registration Failed', {
      description: getErrorMessage(err),
    });
  }
});
</script>
