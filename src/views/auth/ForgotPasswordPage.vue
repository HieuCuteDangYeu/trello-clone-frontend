<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription class="text-center">
          Enter your email to receive a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <span v-if="isSubmitting">Sending...</span>
            <span v-else>Send Reset Link</span>
          </Button>
        </form>

        <div class="mt-4 text-center text-sm">
          <RouterLink to="/login" class="underline text-muted-foreground">
            Back to Login
          </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';
import { getErrorMessage } from '@/utils/error';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';

const authStore = useAuthStore();

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(forgotPasswordSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.forgotPassword(values.email);
    toast.success('Reset Link Sent', {
      description: 'Please check your email for the password reset link.',
    });
  } catch (err: unknown) {
    toast.error('Request Failed', {
      description: getErrorMessage(err),
    });
  }
});
</script>
