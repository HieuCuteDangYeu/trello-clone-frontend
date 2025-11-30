<template>
  <div class="min-h-screen bg-slate-50">
    <AppNavbar />

    <div class="container mx-auto p-8 max-w-6xl">
      <h1 class="text-3xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>

      <Tabs default-value="users" class="w-full">
        <TabsList>
          <TabsTrigger value="users">Users Management</TabsTrigger>
          <TabsTrigger value="boards">Decks Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users" class="mt-4">
          <div class="bg-white p-4 rounded-lg border shadow-sm">
            <div class="flex justify-between mb-4">
              <Input v-model="searchQuery" placeholder="Search users..." class="max-w-xs"
                @keyup.enter="adminStore.fetchUsers(1, searchQuery)" />
              <Button @click="adminStore.fetchUsers(1, searchQuery)" :disabled="adminStore.isUsersLoading">
                {{ adminStore.isUsersLoading ? 'Searching...' : 'Search' }}
              </Button>
            </div>

            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <template v-if="adminStore.isUsersLoading">
                    <TableRow v-for="i in 5" :key="i">
                      <TableCell>
                        <div class="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div class="h-4 w-48 bg-slate-200 animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div class="h-5 w-16 bg-slate-200 animate-pulse rounded-full"></div>
                      </TableCell>
                      <TableCell>
                        <div class="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell class="text-right">
                        <div class="h-8 w-8 ml-auto bg-slate-200 animate-pulse rounded"></div>
                      </TableCell>
                    </TableRow>
                  </template>

                  <template v-else-if="adminStore.users.length > 0">
                    <TableRow v-for="user in adminStore.users" :key="user._id">
                      <TableCell class="font-medium">{{ user.username }}</TableCell>
                      <TableCell>{{ user.email }}</TableCell>
                      <TableCell>
                        <Badge :variant="user.role === 'admin' ? 'destructive' : 'secondary'">
                          {{ user.role }}
                        </Badge>
                      </TableCell>
                      <TableCell>{{ new Date(user.createdAt).toLocaleDateString() }}</TableCell>
                      <TableCell class="text-right">
                        <Button variant="ghost" size="icon" class="text-red-600"
                          @click="confirmDelete('user', user._id)">
                          <Trash2 class="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </template>

                  <template v-else>
                    <TableRow>
                      <TableCell colspan="5" class="h-24 text-center text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  </template>
                </TableBody>
              </Table>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <Button variant="outline" :disabled="adminStore.userMeta.page === 1 || adminStore.isUsersLoading"
                @click="adminStore.fetchUsers(adminStore.userMeta.page - 1)">
                Previous
              </Button>
              <Button variant="outline"
                :disabled="adminStore.userMeta.page >= adminStore.userMeta.totalPages || adminStore.isUsersLoading"
                @click="adminStore.fetchUsers(adminStore.userMeta.page + 1)">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="boards" class="mt-4">
          <div class="bg-white p-4 rounded-lg border shadow-sm">

            <div class="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Deck ID (Access)</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead class="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <template v-if="adminStore.isBoardsLoading">
                    <TableRow v-for="i in 5" :key="i">
                      <TableCell>
                        <div class="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div class="h-4 w-48 bg-slate-200 animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div class="h-5 w-16 bg-slate-200 animate-pulse rounded-full"></div>
                      </TableCell>
                      <TableCell class="text-right">
                        <div class="h-8 w-8 ml-auto bg-slate-200 animate-pulse rounded"></div>
                      </TableCell>
                    </TableRow>
                  </template>

                  <template v-else-if="adminStore.boards.length > 0">
                    <TableRow v-for="board in adminStore.boards" :key="board._id">
                      <TableCell class="font-medium">{{ board.title }}</TableCell>

                      <TableCell>
                        <RouterLink :to="`/boards/${board._id}`" class="font-mono text-xs text-blue-600 hover:underline"
                          target="_blank">
                          {{ board._id }} ↗
                        </RouterLink>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">{{ board.isPrivate ? 'Private' : 'Public' }}</Badge>
                      </TableCell>
                      <TableCell class="text-right">
                        <Button variant="ghost" size="icon" class="text-red-600"
                          @click="confirmDelete('board', board._id)">
                          <Trash2 class="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </template>

                  <template v-else>
                    <TableRow>
                      <TableCell colspan="4" class="h-24 text-center text-muted-foreground">
                        No boards found.
                      </TableCell>
                    </TableRow>
                  </template>
                </TableBody>
              </Table>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <Button variant="outline" :disabled="adminStore.boardMeta.page === 1 || adminStore.isBoardsLoading"
                @click="adminStore.fetchSystemBoards(adminStore.boardMeta.page - 1)">
                Previous
              </Button>
              <Button variant="outline"
                :disabled="adminStore.boardMeta.page >= adminStore.boardMeta.totalPages || adminStore.isBoardsLoading"
                @click="adminStore.fetchSystemBoards(adminStore.boardMeta.page + 1)">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>

    <ConfirmDeleteDialog :open="isDeleteOpen" :title="deleteType === 'user' ? 'Delete User?' : 'Delete Deck?'"
      :description="deleteDescription" @update:open="isDeleteOpen = $event" @confirm="handleDelete"
      @cancel="isDeleteOpen = false" />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminStore } from '@/stores/admin';
import { Trash2 } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

const adminStore = useAdminStore();
const searchQuery = ref('');
const isDeleteOpen = ref(false);
const deleteType = ref<'user' | 'board' | null>(null);
const idToDelete = ref<string | null>(null);

const deleteDescription = computed(() => {
  return deleteType.value === 'user'
    ? 'This will permanently delete the user account and all their data.'
    : 'This will permanently delete the deck and all stages/words inside it.';
});

onMounted(() => {
  adminStore.fetchUsers();
  adminStore.fetchSystemBoards();
});

const confirmDelete = (type: 'user' | 'board', id: string) => {
  deleteType.value = type;
  idToDelete.value = id;
  isDeleteOpen.value = true;
};

const handleDelete = async () => {
  if (!idToDelete.value || !deleteType.value) return;

  if (deleteType.value === 'user') {
    await adminStore.deleteUser(idToDelete.value);
  } else {
    await adminStore.deleteBoard(idToDelete.value);
  }

  isDeleteOpen.value = false;
  idToDelete.value = null;
  deleteType.value = null;
};
</script>
