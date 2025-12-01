<template>
  <div class="min-h-screen bg-slate-50">
    <AppNavbar />

    <div class="container mx-auto p-8 max-w-2xl">
      <h1 class="text-3xl font-bold text-slate-800 mb-6">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account settings and email preferences.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form @submit="onSubmit" class="space-y-4">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="johndoe" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="flex justify-end pt-4">
              <Button type="submit" :disabled="isSubmitting">
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>Save Changes</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateProfileSchema } from '@/schemas/auth'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/utils/error'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(updateProfileSchema),
  initialValues: {
    username: authStore.user?.username || '',
    email: authStore.user?.email || '',
  },
})

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      setValues({
        username: newUser.username,
        email: newUser.email,
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.updateProfile({
      username: values.username,
      email: values.email,
    })

    toast.success('Profile updated', {
      description: 'Your account information has been saved.',
    })
  } catch (err: unknown) {
    toast.error('Update Failed', {
      description: getErrorMessage(err),
    })
  }
})
</script>
