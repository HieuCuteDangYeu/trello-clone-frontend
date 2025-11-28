<template>
  <div v-if="!isEditing" @click="startEditing"
    class="cursor-pointer hover:bg-gray-200/50 rounded px-2 py-1 -ml-2 min-h-7 flex items-center transition-colors">
    <slot>{{ text }}</slot>
  </div>
  <input v-else ref="inputRef" v-model="localValue" @blur="save" @keydown.enter="save" @keydown.esc="cancel"
    class="w-full px-2 py-1 rounded border border-blue-500 outline-none text-sm h-7 bg-white shadow-sm" />
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  text: string;
}>();

const emit = defineEmits<{
  (e: 'save', value: string): void;
}>();

const isEditing = ref(false);
const localValue = ref(props.text);
const inputRef = ref<HTMLInputElement | null>(null);

watch(() => props.text, (newVal) => {
  localValue.value = newVal;
});

const startEditing = async () => {
  isEditing.value = true;
  localValue.value = props.text;
  await nextTick();
  inputRef.value?.focus();
  inputRef.value?.select();
};

const save = () => {
  if (localValue.value.trim() && localValue.value !== props.text) {
    emit('save', localValue.value);
  }
  isEditing.value = false;
};

const cancel = () => {
  isEditing.value = false;
  localValue.value = props.text;
};
</script>
