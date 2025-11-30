<template>
  <Dialog :open="open" @update:open="close">
    <DialogContent class="sm:max-w-[600px] min-h-[500px] flex flex-col p-0 gap-0 overflow-hidden bg-slate-50">

      <div class="px-6 py-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
        <div>
          <DialogTitle class="text-xl flex items-center gap-2">
            <span
              class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold">Quiz</span>
            {{ listName }}
          </DialogTitle>
          <DialogDescription class="text-xs mt-1 flex items-center gap-1">
            <span>Progression:</span>
            <span class="font-semibold text-slate-700">{{ listName }}</span>
            <span class="text-slate-400">→</span>
            <span class="font-semibold text-green-600">{{ destinationName || 'Mastered' }}</span>
          </DialogDescription>
        </div>

        <div class="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="bg-blue-600 h-full transition-all duration-500 ease-out"
            :style="{ width: `${((currentIndex + 1) / cards.length) * 100}%` }"></div>
        </div>
      </div>

      <div class="flex-1 p-8 flex flex-col items-center justify-center relative w-full">
        <div v-if="isFinished" class="text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div class="text-7xl mb-4">🎉</div>
          <div class="space-y-2">
            <h3 class="text-2xl font-bold text-slate-800">Session Complete!</h3>
            <p class="text-slate-500 max-w-xs mx-auto">You've reviewed all words in this list.</p>
          </div>
          <Button size="lg" @click="close" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            Back to Board
          </Button>
        </div>

        <div v-else-if="currentCard" class="w-full max-w-sm perspective-container">

          <div class="relative w-full aspect-4/3 cursor-pointer group transition-all duration-500 transform-style-3d"
            :class="{ 'rotate-y-180': isFlipped }" @click="flipCard">
            <div
              class="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 shadow-sm group-hover:border-blue-300 group-hover:shadow-md transition-all">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Word</span>
              <h2 class="text-4xl font-bold text-slate-800 text-center wrap-break-word leading-tight">
                {{ currentCard.title }}
              </h2>

              <div
                class="absolute bottom-6 text-slate-400 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                <span class="text-[10px] uppercase tracking-widest font-semibold">Tap to Flip</span>
              </div>
            </div>

            <div
              class="absolute inset-0 backface-hidden bg-blue-50 border-2 border-blue-200 rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm rotate-y-180 text-center">
              <span class="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Meaning</span>

              <h2 class="text-2xl font-bold text-slate-800 mb-2">{{ currentCard.translation }}</h2>

              <div v-if="currentCard.pronunciation"
                class="text-sm font-mono text-slate-500 bg-white/60 px-2 py-1 rounded border border-blue-100 mb-4 inline-block">
                /{{ currentCard.pronunciation }}/
              </div>

              <div v-if="currentCard.example"
                class="text-sm text-slate-600 italic border-t border-blue-200/50 pt-4 w-full px-4">
                "{{ currentCard.example }}"
              </div>
            </div>
          </div>

          <div class="h-24 mt-8 flex items-center justify-center w-full">
            <div v-if="isFlipped" class="flex gap-3 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
              <Button variant="outline"
                class="flex-1 h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                @click="handleResult(false)">
                Incorrect
              </Button>
              <Button class="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white shadow-green-200 shadow-lg"
                @click="handleResult(true)">
                Correct
              </Button>
            </div>
            <div v-else class="text-sm text-slate-400 italic animate-pulse select-none">
              Tap card to reveal answer
            </div>
          </div>

        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useCardStore } from '@/stores/card';
import type { Card } from '@/types/card';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';

const props = defineProps<{
  open: boolean;
  cards: Card[];
  listName: string;
  nextListId?: string;
  destinationName?: string;
}>();

const emit = defineEmits(['update:open']);
const cardStore = useCardStore();
const currentIndex = ref(0);
const isFlipped = ref(false);
const isFinished = ref(false);

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    currentIndex.value = 0;
    isFlipped.value = false;
    isFinished.value = false;
  }
});

const currentCard = computed(() => props.cards[currentIndex.value]);

const close = () => emit('update:open', false);

const flipCard = () => {
  isFlipped.value = !isFlipped.value;
};

const handleResult = async (correct: boolean) => {
  if (correct && props.nextListId && currentCard.value) {
    try {
      await cardStore.moveCard(currentCard.value._id, props.nextListId, 0);

      toast.success(`Moved "${currentCard.value.title}" to next stage!`, {
        position: 'bottom-center'
      });
    } catch (e) {
      console.error('Failed to move card', e);
      toast.error('Failed to save progress');
    }
  } else if (correct && !props.nextListId) {
    toast.success('Card mastered!', { duration: 1500, position: 'bottom-center' });
  }

  if (currentIndex.value < props.cards.length - 1) {
    setTimeout(() => {
      isFlipped.value = false;
      currentIndex.value++;
    }, 150);
  } else {
    isFinished.value = true;
  }
};
</script>

<style scoped>
.perspective-container {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
