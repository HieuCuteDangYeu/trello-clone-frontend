<template>
  <div class="h-screen flex flex-col bg-slate-100 overflow-hidden">
    <header class="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm shrink-0">
      <div class="flex items-center gap-4">
        <div v-if="isPageLoading" class="h-8 w-48 bg-slate-200 animate-pulse rounded"></div>
        <h1 v-else class="font-bold text-xl text-slate-800">
          {{ boardStore.currentBoard?.title }}
        </h1>
      </div>
      <Button variant="outline" size="sm" @click="$router.push('/boards')">
        <ArrowLeft class="w-4 h-4" />Back to Dashboard
      </Button>
    </header>

    <div class="flex-1 overflow-x-auto overflow-y-hidden">
      <div class="h-full flex px-6 pb-4 gap-5 items-start pt-6">

        <template v-if="isPageLoading">
          <div v-for="i in 3" :key="i" class="w-72 shrink-0 bg-gray-100 rounded-lg h-96 animate-pulse border">
            <div class="h-10 bg-slate-200 rounded-t-lg mb-4"></div>
            <div class="mx-2 h-20 bg-slate-200 rounded mb-2"></div>
            <div class="mx-2 h-20 bg-slate-200 rounded"></div>
          </div>
        </template>

        <template v-else>
          <draggable v-model="listStore.lists" group="lists" item-key="_id" class="flex gap-5 items-start h-full"
            ghost-class="opacity-50" @change="(event: DraggableChange<List>) => onListDrop(event)">

            <template #item="{ element: list }">
              <div
                class="w-72 shrink-0 bg-gray-100 rounded-lg flex flex-col max-h-full border shadow-sm cursor-default">

                <div
                  class="p-3 pl-4 font-semibold text-sm text-slate-700 flex justify-between items-center cursor-grab active:cursor-grabbing handle">
                  <EditableText :text="list.title" class="flex-1 font-semibold"
                    @save="(val: string) => listStore.updateListTitle(list._id, val)" />

                  <div class="flex items-center gap-1">
                    <Button variant="ghost" size="icon"
                      class="h-6 w-6 text-slate-400 hover:text-green-600 hover:bg-green-50" @click="startQuiz(list._id)"
                      title="Start Quiz">
                      <PlayCircle class="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="icon" class="h-6 w-6 text-slate-400 hover:text-red-600"
                      @click="handleDeleteList(list._id)">
                      <X class="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div class="flex-1 overflow-y-auto p-2 min-h-8 scrollbar-thin">
                  <draggable :list="cardStore.cards[list._id] || []" group="cards" item-key="_id"
                    ghost-class="opacity-50" @change="(event: DraggableChange<Card>) => onCardDrop(event, list._id)">

                    <template #item="{ element: card }">
                      <div
                        class="bg-white p-3 mb-2 rounded shadow-sm border border-slate-200 hover:border-blue-400 group relative flex flex-col gap-1 cursor-pointer transition-all"
                        @click="toggleReveal(card._id)">
                        <div class="flex justify-between items-start">
                          <span class="font-bold text-slate-800 text-lg">{{ card.title }}</span>

                          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon"
                              class="h-6 w-6 text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                              @click.stop="speakWord(card.title)" title="Listen">
                              <Volume2 class="w-3.5 h-3.5" />
                            </Button>

                            <Button variant="ghost" size="icon"
                              class="h-6 w-6 text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                              @click.stop="openEditDialog(card)" title="Edit">
                              <Pencil class="w-3.5 h-3.5" />
                            </Button>

                            <Button variant="ghost" size="icon"
                              class="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-slate-100"
                              @click.stop="handleDeleteCard(card._id)" title="Delete">
                              <X class="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div class="min-h-6">
                          <div v-if="revealedCards.has(card._id)" class="animate-in fade-in duration-200">
                            <p class="text-sm text-slate-700 font-medium border-t pt-1 mt-1 border-slate-100">
                              {{ card.translation }}
                            </p>
                            <p v-if="card.pronunciation" class="text-xs text-slate-500 font-mono mt-0.5">
                              /{{ card.pronunciation }}/
                            </p>
                            <p v-if="card.example"
                              class="text-xs text-slate-500 italic mt-1 border-l-2 border-blue-200 pl-2">
                              "{{ card.example }}"
                            </p>
                          </div>
                          <p v-else class="text-slate-300 italic text-xs select-none mt-1">Click to reveal...</p>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>

                <div class="p-2 pt-0">
                  <form v-if="addingCardToList === list._id" @submit.prevent="handleAddCard(list._id)"
                    class="mt-2 p-2 bg-slate-50 rounded border">
                    <Input v-model="newCardTitle" placeholder="Word (e.g. Katze)" class="bg-white mb-2 h-8 text-sm"
                      autoFocus />
                    <Input v-model="newCardTranslation" placeholder="Meaning (e.g. Cat)"
                      class="bg-white mb-2 h-8 text-sm" />
                    <div class="flex gap-2">
                      <Button type="submit" size="sm" class="h-7 px-3 text-xs">Add Word</Button>
                      <Button type="button" variant="ghost" size="sm" class="h-7 px-2" @click="cancelAddCard">
                        <X class="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                  <Button v-else variant="ghost" size="sm"
                    class="w-full justify-start text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                    @click="startAddCard(list._id)">
                    <Plus class="w-4 h-4" /> Add word
                  </Button>
                </div>
              </div>
            </template>
          </draggable>

          <div class="w-72 shrink-0">
            <form v-if="isAddingList" @submit.prevent="handleAddList" class="bg-white p-3 rounded-lg border shadow-sm">
              <Input v-model="newListTitle" placeholder="Category (e.g. New Words)..." class="mb-2" autoFocus />
              <div class="flex gap-2">
                <Button type="submit" size="sm">Add Category</Button>
                <Button type="button" variant="ghost" size="sm" @click="isAddingList = false">
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </form>
            <Button v-else
              class="w-full bg-white/50 hover:bg-white/80 text-slate-700 justify-start border-2 border-dashed border-slate-300"
              @click="isAddingList = true">
              <Plus class="w-4 h-4" /> Add category
            </Button>
          </div>
        </template>
      </div>
    </div>

    <ConfirmDeleteDialog :open="isDeleteOpen" title="Delete List?"
      description="This will permanently delete the list and all words inside it." @update:open="isDeleteOpen = $event"
      @confirm="confirmDeleteList" @cancel="isDeleteOpen = false" />

    <EditCardDialog :open="isEditOpen" :card="cardToEdit" @update:open="isEditOpen = $event" />

    <QuizDialog :open="isQuizOpen" :cards="quizCards" :list-name="quizListName" :next-list-id="quizNextListId"
      :destination-name="quizDestinationName" @update:open="isQuizOpen = $event" />
  </div>
</template>

<script setup lang="ts">
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import EditCardDialog from '@/components/EditCardDialog.vue';
import EditableText from '@/components/EditableText.vue';
import QuizDialog from '@/components/QuizDialog.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBoardStore } from '@/stores/board';
import { useCardStore } from '@/stores/card';
import { useListStore } from '@/stores/list';
import type { Card } from '@/types/card';
import type { DraggableChange } from '@/types/drag-drop';
import type { List } from '@/types/list';
import type { WindowWithResponsiveVoice } from '@/types/voice';
import { ArrowLeft, Pencil, PlayCircle, Plus, Volume2, X } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import draggable from 'vuedraggable';

const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();
const listStore = useListStore();
const cardStore = useCardStore();
const boardId = route.params.id as string;
const isPageLoading = ref(true);
const isAddingList = ref(false);
const newListTitle = ref('');
const addingCardToList = ref<string | null>(null);
const newCardTitle = ref('');
const newCardTranslation = ref('');
const isDeleteOpen = ref(false);
const listToDelete = ref<string | null>(null);
const revealedCards = ref(new Set<string>());
const isEditOpen = ref(false);
const cardToEdit = ref<Card | null>(null);
const isQuizOpen = ref(false);
const quizCards = ref<Card[]>([]);
const quizListName = ref('');
const quizNextListId = ref<string | undefined>(undefined);
const quizDestinationName = ref('');

onMounted(async () => {
  isPageLoading.value = true;
  try {
    await Promise.all([
      boardStore.fetchBoard(boardId),
      listStore.fetchLists(boardId)
    ]);

    await Promise.all(
      listStore.lists.map(list => cardStore.fetchCardsForList(list._id))
    );
  } catch {
    toast.error('Board not found');
    router.push('/boards');
  } finally {
    isPageLoading.value = false;
  }
});

// --- Flashcard Logic ---
const toggleReveal = (cardId: string) => {
  if (revealedCards.value.has(cardId)) {
    revealedCards.value.delete(cardId);
  } else {
    revealedCards.value.add(cardId);
  }
};

const speakWord = (text: string) => {
  if (!text) return;

  const voiceName = boardStore.currentBoard?.language || 'US English Male';
  const rv = (window as unknown as WindowWithResponsiveVoice).responsiveVoice;

  if (rv) {
    rv.speak(text, voiceName, {
      onstart: () => console.log('Speaking started...'),
      onend: () => console.log('Speaking finished.'),
      onerror: (e: unknown) => {
        console.error('RV Error:', e);
        toast.error('Audio failed to play');
      }
    });
  } else {
    toast.error('Audio library not loaded. Check internet connection.');
  }
};

const openEditDialog = (card: Card) => {
  cardToEdit.value = card;
  isEditOpen.value = true;
};

// --- Drag & Drop ---
const onListDrop = (event: DraggableChange<List>) => {
  if (event.moved) {
    const { element, newIndex, oldIndex } = event.moved;
    listStore.moveList(element._id, newIndex, oldIndex);
  }
};

const onCardDrop = (event: DraggableChange<Card>, listId: string) => {
  if (event.moved) {
    const { element, newIndex } = event.moved;
    cardStore.moveCard(element._id, listId, newIndex);
  }
  else if (event.added) {
    const { element, newIndex } = event.added;
    cardStore.moveCard(element._id, listId, newIndex);
  }
};

// --- Lists Logic ---
const handleAddList = async () => {
  if (!newListTitle.value.trim()) return;
  try {
    await listStore.createList({ title: newListTitle.value, boardId });
    newListTitle.value = '';
    isAddingList.value = false;
  } catch {
    toast.error('Failed to add list');
  }
};

const handleDeleteList = (listId: string) => {
  listToDelete.value = listId;
  isDeleteOpen.value = true;
};

const confirmDeleteList = async () => {
  if (!listToDelete.value) return;
  try {
    await listStore.deleteList(listToDelete.value);
  } catch {
    toast.error('Failed to delete list');
  } finally {
    isDeleteOpen.value = false;
    listToDelete.value = null;
  }
};

const startAddCard = (listId: string) => {
  addingCardToList.value = listId;
  newCardTitle.value = '';
  newCardTranslation.value = '';
};

const cancelAddCard = () => {
  setTimeout(() => {
    if (!newCardTitle.value && !newCardTranslation.value) {
      addingCardToList.value = null;
    }
  }, 100);
};

const handleAddCard = async (listId: string) => {
  if (!newCardTitle.value.trim() || !newCardTranslation.value.trim()) return;

  try {
    await cardStore.createCard({
      title: newCardTitle.value,
      translation: newCardTranslation.value,
      listId,
      boardId
    });
    newCardTitle.value = '';
    newCardTranslation.value = '';
  } catch {
    toast.error('Failed to add word');
  }
};

const handleDeleteCard = async (cardId: string) => {
  await cardStore.deleteCard(cardId);
};

const startQuiz = (listId: string) => {
  const list = listStore.lists.find(l => l._id === listId);
  if (!list) return;

  const cards = cardStore.cards[listId] || [];

  if (cards.length === 0) {
    toast.warning('Add some words to this list first!');
    return;
  }

  const listIndex = listStore.lists.indexOf(list);
  const nextList = listStore.lists[listIndex + 1];

  quizCards.value = [...cards];
  quizListName.value = list.title;

  if (nextList) {
    quizNextListId.value = nextList._id;
    quizDestinationName.value = nextList.title;
  } else {
    quizNextListId.value = undefined;
    quizDestinationName.value = 'Mastered (Final Stage)';
  }

  isQuizOpen.value = true;
};
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
