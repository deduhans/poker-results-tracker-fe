<template>
    <v-card class="mt-16">
        <v-card-title class="text-center">Create User</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid">
                <v-text-field v-model="userName" label="Name" required></v-text-field>
                <v-text-field v-model="password" label="Password" required></v-text-field>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="createUser">Create</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import UserController from '@/network/lib/user';
import type { CreateUser } from '@/types/user/CreateUser';
import type { User } from '@/types/user/User';

const userStore = useUserStore();
const router = useRouter();

const userName = ref('');
const password = ref('');
const valid = ref(false);

const userController = new UserController();

const createUser = async () => {
    try {
        const user: CreateUser = {
            username: userName.value,
            password: password.value
        };

        const newUser: User = await userController.createUser(user);
        userStore.setUser({ userId: newUser.id, name: newUser.username });

        router.push({ name: 'home' });
    } catch (error) {
        console.error('Error creating user:', error);
    }
};
</script>
