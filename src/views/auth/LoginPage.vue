<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription class="text-center">
          Enter your credentials to access your workspace
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="onSubmit" class="space-y-4">
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
              <div class="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <RouterLink to="/forgot-password" class="text-xs underline text-muted-foreground hover:text-primary">
                  Forgot password?
                </RouterLink>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <span v-if="isSubmitting">Logging in...</span>
            <span v-else>Sign In</span>
          </Button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div class="flex justify-center w-full">
          <GoogleLogin :callback="handleGoogleCallback" />
        </div>

        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <RouterLink to="/register" class="underline text-primary">Sign up</RouterLink>
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
import { loginSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';
import { getErrorMessage } from '@/utils/error';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login';

const router = useRouter();
const authStore = useAuthStore();

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const handleRedirect = () => {
  if (authStore.user?.role === 'admin') {
    router.push('/admin');
  } else {
    router.push('/boards');
  }
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values);
    successToast();
    handleRedirect();
  } catch (err: unknown) {
    toast.error('Login Failed', {
      description: getErrorMessage(err),
    });
  }
});

const handleGoogleCallback: CallbackTypes.CredentialCallback = async (response) => {
  try {
    await authStore.googleLogin(response.credential);
    successToast();
    handleRedirect();
  } catch (err: unknown) {
    toast.error('Authentication Failed', {
      description: getErrorMessage(err),
    });
  }
};

const successToast = () => {
  toast.success('Logged in successfully!', {
    description: 'Welcome back to your workspace.',
  });
};
</script>
