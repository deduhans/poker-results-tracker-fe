<template>
    <v-card class="mt-16">
        <v-card-title class="text-center">Log in</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid">
                <v-text-field v-model="userName" label="Name" required></v-text-field>
                <v-text-field v-model="password" label="Password" required></v-text-field>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Log in</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import AuthController from '@/network/lib/auth';
import type { Auth } from '@/types/auth/Auth';

const authController = new AuthController();

const userStore = useUserStore();
const router = useRouter();

const userName = ref('');
const password = ref('');
const valid = ref(false);

const login = async () => {
    try {
        const auth: Auth = {
            username: userName.value,
            password: password.value
        };

        const user: any = await authController.login(auth);
        userStore.setUser({ userId: user.User.userId, name: user.User.userName });

        router.push({ name: 'home' });
    } catch (error) {
        console.error('Error login:', error);
    }
}
</script>