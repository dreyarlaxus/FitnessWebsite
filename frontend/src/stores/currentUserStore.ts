import { defineStore } from 'pinia';

export const useCurrentUserStore = defineStore('current-user', {
   state: () => {
      const storedCurrentUser = localStorage.getItem('currentUser');

      return {
         currentUser: storedCurrentUser ? JSON.parse(storedCurrentUser) : null
      };
   },
   actions: {
      setCurrentUser(user: any) {
         this.currentUser = user;
         localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      },

      clearUser() {
         this.currentUser = null;
         localStorage.removeItem('currentUser');
      }
   }
});
