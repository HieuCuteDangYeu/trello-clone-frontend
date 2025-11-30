<template>
  <nav class="border-b bg-white px-6 py-3 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <div class="bg-blue-600 p-1.5 rounded text-white font-bold text-lg">VB</div>
      <span class="font-bold text-xl tracking-tight text-slate-800">VocabBuilder</span>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm font-medium text-slate-600" v-if="authStore.user">
        {{ authStore.user.username }}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative h-8 w-8 rounded-full">
            <Avatar class="h-8 w-8">
              <AvatarImage :src="`https://api.dicebear.com/7.x/initials/svg?seed=${authStore.user?.username}`" />
              <AvatarFallback>{{ authStore.user?.username?.charAt(0).toUpperCase() }}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout" class="text-red-600 cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
