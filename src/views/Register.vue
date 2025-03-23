<template>
    <v-card class="mt-16 mx-auto" max-width="400">
        <v-card-title class="text-center">Create User</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="createUser">
                <v-text-field v-model="userName" label="Username" :rules="userNameRules" required
                    :disabled="loading" hint="Username must be 3-20 characters long"></v-text-field>

                <v-text-field v-model="password" label="Password" :rules="passwordRules" required
                    :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword" :disabled="loading"
                    hint="Password must be at least 8 characters with numbers and letters"></v-text-field>

                <v-text-field v-model="confirmPassword" label="Confirm Password"
                    :rules="[...passwordRules, passwordConfirmationRule]" required
                    :type="showPassword ? 'text' : 'password'" :disabled="loading"></v-text-field>

                <v-alert v-if="error" density="compact" type="error" variant="outlined" class="mt-3">{{ errorMessage
                    }}</v-alert>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-btn color="secondary" @click="goToLogin" :disabled="loading">
                Back to Login
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="createUser" :loading="loading" :disabled="!valid || loading">
                Create Account
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import UserController from '@/network/lib/user';
import type { CreateUser } from '@/types/user/CreateUser';
import type { User } from '@/types/user/User';
import type { Auth } from '@/types/auth/Auth';
import AuthController from '@/network/lib/auth';

const userStore = useUserStore();
const router = useRouter();
const form = ref<any>(null);

const userName = ref('');
const password = ref('');
const confirmPassword = ref('');
const valid = ref(false);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const userController = new UserController();
const authController = new AuthController();

const userNameRules = [
  (v: string) => !!v || 'Username is required',
  (v: string) => (v && v.length >= 3) || 'Username must be at least 3 characters',
  (v: string) => (v && v.length <= 20) || 'Username must be less than 20 characters',
  (v: string) => /^[a-zA-Z0-9_-]+$/.test(v) || 'Username can only contain letters, numbers, underscores and dashes',
];

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
  (v: string) => /\d/.test(v) || 'Password must contain at least one number',
  (v: string) => /[a-zA-Z]/.test(v) || 'Password must contain at least one letter',
];

const passwordConfirmationRule = (v: string) =>
  v === password.value || 'Passwords must match';

const goToLogin = () => {
  router.push({ name: 'login' });
};

const createUser = async () => {
  if (!form.value?.validate()) return;

  try {
    loading.value = true;
    error.value = false;

    const user: CreateUser = {
      username: userName.value,
      password: password.value,
    };

    const newUser: User = await userController.createUser(user);
    await authController.login(user as Auth);
    userStore.setUser({ userId: newUser.id, name: newUser.username });
    router.push({ name: 'home' });
  } catch (e: any) {
    error.value = true;
    errorMessage.value = e.response?.data?.message || 'Error creating user. Please try again.';
    console.error('Error creating user:', e);
  } finally {
    loading.value = false;
  }
};
</script>
