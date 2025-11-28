<template>
  <AlertDialog :open="open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="$emit('cancel')">Cancel</AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirm')" class="bg-red-600 hover:bg-red-700 text-white">
          {{ confirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, default: 'Are you sure?' },
  description: { type: String, default: 'This action cannot be undone. This will permanently delete this item.' },
  confirmText: { type: String, default: 'Delete' },
});

defineEmits(['update:open', 'confirm', 'cancel']);
</script>
