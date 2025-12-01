<template>
  <div class="min-h-screen bg-slate-50">
    <AppNavbar />

    <div class="container mx-auto p-8 max-w-6xl">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-slate-800">My Language Decks</h1>

        <Button @click="openCreateDialog" class="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
          <Plus class="w-4 h-4" /> Create New Deck
        </Button>
      </div>

      <div v-if="boardStore.isLoading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-32 bg-slate-200 animate-pulse rounded-lg"></div>
      </div>

      <div v-else-if="boardStore.boards.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card v-for="board in boardStore.boards" :key="board._id"
          class="h-32 hover:shadow-md transition-all cursor-pointer bg-white border-l-4 border-l-blue-500 flex flex-col justify-center px-6 group relative">

          <div @click="openBoard(board._id)" class="absolute inset-0 z-0"></div>

          <CardTitle
            class="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors pointer-events-none">
            {{ board.title }}
          </CardTitle>
          <p class="text-sm text-slate-500 mt-1 pointer-events-none">{{ board.description }}</p>

          <div class="absolute top-3 right-3 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon"
                  class="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer">
                  <MoreHorizontal class="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="openRenameDialog(board)">
                  <Pencil class="w-4 h-4 mr-2" /> Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="confirmDeleteBoard(board._id)" class="text-red-600 focus:text-red-600">
                  <Trash2 class="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </div>

      <div v-else class="text-center py-20">
        <div class="text-slate-400 text-xl font-medium">No decks found</div>
        <p class="text-slate-500 mt-2">Create your first language deck to get started!</p>
      </div>
    </div>

    <Dialog v-model:open="isDialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Rename Deck' : 'Create Deck' }}</DialogTitle>
          <DialogDescription>
            {{ isEditing ? 'Update the name of your deck.' : 'Start a new language collection.' }}
          </DialogDescription>
        </DialogHeader>

        <form @submit="onSubmit" class="space-y-4 mt-4">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Deck Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Project Alpha" v-bind="componentField" autofocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Irregular verbs list" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="language">
            <FormItem>
              <FormLabel>Target Language (Voice)</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    <SelectItem v-for="lang in supportedLanguages" :key="lang.value" :value="lang.value">
                      {{ lang.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex justify-end gap-3 pt-4">
            <Button class="cursor-pointer" type="button" variant="outline" @click="isDialogOpen = false">
              Cancel
            </Button>
            <Button class="cursor-pointer" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Deck') }}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <ConfirmDeleteDialog :open="isDeleteOpen" title="Delete Deck?"
      description="This will permanently delete this deck and all stages/words inside it."
      @update:open="isDeleteOpen = $event" @confirm="handleDeleteBoard" @cancel="isDeleteOpen = false" />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBoardSchema } from '@/schemas/board';
import { useBoardStore } from '@/stores/board';
import type { Board } from '@/types/board';
import { getErrorMessage } from '@/utils/error';
import { toTypedSchema } from '@vee-validate/zod';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();
const boardStore = useBoardStore();
const isDialogOpen = ref(false);
const isEditing = ref(false);
const editingBoardId = ref<string | null>(null);
const isDeleteOpen = ref(false);
const boardToDelete = ref<string | null>(null);
const supportedLanguages = [
  { label: 'English (US)', value: 'US English Male' },
  { label: 'English (UK)', value: 'UK English Female' },
  { label: 'Vietnamese', value: 'Vietnamese Male' },
  { label: 'French', value: 'French Female' },
  { label: 'Spanish', value: 'Spanish Female' },
  { label: 'German', value: 'Deutsch Female' },
  { label: 'Japanese', value: 'Japanese Female' },
  { label: 'Korean', value: 'Korean Female' },
]

onMounted(() => {
  boardStore.fetchBoards();
});

const openBoard = (id: string) => {
  router.push(`/boards/${id}`);
};

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(createBoardSchema),
});

const openCreateDialog = () => {
  isEditing.value = false;
  editingBoardId.value = null;
  resetForm();
  isDialogOpen.value = true;
};

const openRenameDialog = (board: Board) => {
  isEditing.value = true;
  editingBoardId.value = board._id;
  setValues({
    title: board.title,
    description: board.description || '',
    language: board.language || 'US English Male'
  });
  isDialogOpen.value = true;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isEditing.value && editingBoardId.value) {
      await boardStore.updateBoard(editingBoardId.value, {
        title: values.title,
        description: values.description,
        language: values.language
      });
      toast.success('Deck updated');
      isDialogOpen.value = false;
    } else {
      const newBoard = await boardStore.createBoard({
        title: values.title,
        description: values.description,
        language: values.language,
        isPrivate: true
      });
      toast.success('Deck created');
      isDialogOpen.value = false;
      resetForm();
      router.push(`/boards/${newBoard._id}`);
    }
  } catch (err) {
    toast.error(isEditing.value ? 'Failed to update deck' : 'Failed to create deck', {
      description: getErrorMessage(err)
    });
  }
});

const confirmDeleteBoard = (boardId: string) => {
  boardToDelete.value = boardId;
  isDeleteOpen.value = true;
};

const handleDeleteBoard = async () => {
  if (!boardToDelete.value) return;
  try {
    await boardStore.deleteBoard(boardToDelete.value);
    toast.success('Deck deleted');
  } catch (err) {
    toast.error('Failed to delete deck', { description: getErrorMessage(err) });
  } finally {
    isDeleteOpen.value = false;
    boardToDelete.value = null;
  }
};
</script>
