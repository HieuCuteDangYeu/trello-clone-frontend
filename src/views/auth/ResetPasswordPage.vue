<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-center">New Password</CardTitle>
        <CardDescription class="text-center">
          Enter your new password below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit="onSubmit" class="space-y-4">

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>New Password</FormLabel>
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
            <span v-if="isSubmitting">Resetting...</span>
            <span v-else>Reset Password</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth';
import { getErrorMessage } from '@/utils/error';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const token = route.query.token as string;

if (!token) {
  toast.error('Invalid Link', { description: 'Missing reset token.' });
  router.push('/login');
}

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.resetPassword(token, values.password);
    toast.success('Password Reset Successful', {
      description: 'You can now log in with your new password.',
    });
    router.push('/login');
  } catch (err: unknown) {
    toast.error('Reset Failed', {
      description: getErrorMessage(err),
    });
  }
});
</script>
