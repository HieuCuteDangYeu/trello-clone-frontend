<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Edit Vocabulary Card</DialogTitle>
        <DialogDescription>
          Update the word details, translation, and learning notes.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit" class="space-y-4 mt-2">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Word</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Katze" v-bind="componentField" autofocus />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="translation">
          <FormItem>
            <FormLabel>Translation</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Cat" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="pronunciation">
          <FormItem>
            <FormLabel>Pronunciation (IPA)</FormLabel>
            <FormControl>
              <Input placeholder="e.g. /ˈkat.t͡sə/" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="example">
          <FormItem>
            <FormLabel>Example Sentence</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g. Die Katze schläft auf dem Sofa." class="resize-none"
                v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cardSchema } from '@/schemas/card';
import { useCardStore } from '@/stores/card';
import type { Card } from '@/types/card';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { watch } from 'vue';
import { toast } from 'vue-sonner';

const props = defineProps<{
  open: boolean
  card: Card | null
}>()

const emit = defineEmits(['update:open'])
const cardStore = useCardStore()

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(cardSchema),
})

watch(
  () => props.card,
  (newCard) => {
    if (newCard) {
      setValues({
        title: newCard.title,
        translation: newCard.translation,
        pronunciation: newCard.pronunciation || '',
        example: newCard.example || '',
      })
    }
  },
  { immediate: true }
)

const close = () => {
  emit('update:open', false)
  resetForm()
}

const onOpenChange = (val: boolean) => {
  if (!val) close()
}

const onSubmit = handleSubmit(async (values) => {
  if (!props.card) return

  try {
    await cardStore.updateCard(props.card._id, values)
    toast.success('Card updated successfully')
    close()
  } catch {
    toast.error('Failed to update card')
  }
})
</script>
