import axiosInstance from './APIService';
// import { useCurrentUserStore } from '@/stores/currentUserStore';

// const currentUserStore = useCurrentUserStore();

class UserService {
   API: any;

   constructor(baseURL = 'http://localhost:3000/auth') {
      this.API = axiosInstance(baseURL);
   }

   async register(data: any) {
      return await this.API.post('/register', data);
   }

   async login(data: any) {
      const response = await this.API.post('/login', data);
      // if (response.data?.data?.user) {
      //    // localStorage.setItem('user', JSON.stringify(response.data.data.user));
      // }
      return response;
   }

   async logout() {
      // localStorage.removeItem('user');
      // currentUserStore.clearUser;
      return await this.API.post('/logout');
   }

   getLocalUser() {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
   }

   async updateVip(userId: number) {
      if (!userId) {
         throw new Error('User id is missing');
      }

      console.log(`Sending VIP update request for userI: ${userId}`);

      const response = await this.API.put(`/vip/${userId}`, { vipStatus: 1 });
      console.log(response);
      // const user = this.getLocalUser();
      // if (user) {
      //    user.vip = 1;
      //    localStorage.setItem('user', JSON.stringify(user));
      // }
      return response;
   }
}

export default new UserService();
