<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <Card class="w-full max-w-md text-center p-6">
      <div class="flex justify-center mb-4">
        <div v-if="loading" class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div v-else-if="success" class="text-green-500 text-4xl">✓</div>
        <div v-else class="text-red-500 text-4xl">✕</div>
      </div>

      <h1 class="text-2xl font-bold mb-2">
        {{ loading ? 'Verifying...' : success ? 'Email Verified!' : 'Verification Failed' }}
      </h1>

      <p class="text-muted-foreground mb-6">
        {{ message }}
      </p>

      <Button v-if="!loading" @click="$router.push('/login')">
        Go to Login
      </Button>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getErrorMessage } from '@/utils/error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const route = useRoute();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref(false);
const message = ref('Please wait while we verify your email address.');

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    loading.value = false;
    success.value = false;
    message.value = 'Invalid or missing verification token.';
    return;
  }

  try {
    await authStore.verifyEmail(token);
    success.value = true;
    message.value = 'Your email has been successfully verified. You can now log in.';
  } catch (err: unknown) {
    success.value = false;
    message.value = getErrorMessage(err);
  } finally {
    loading.value = false;
  }
});
</script>
