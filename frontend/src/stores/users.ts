import { defineStore } from "pinia";
import { getAllUsers } from "@/api/users";
import type { User } from "@/types";

export const useUserStore = defineStore("user", {
    state: () => ({
        users: null as null | Array<User>
    }),
    actions: {
        async fetchUsers() {
            const response = await getAllUsers();
            this.users = response.data;
        }
    }
});
