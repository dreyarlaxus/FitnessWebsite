import axiosInstance from './APIService';

class WorkoutService {
   API: any;

   constructor(baseURL = 'http://localhost:3000/workouts') {
      this.API = axiosInstance(baseURL);
   }

   // Lấy danh sách bài tập với phân trang và tìm kiếm
   async getAll(page = 1, limit = 6, workout_name = '', workout_type = '', difficulty = '') {
      const response = await this.API.get('/', {
         params: { page, limit, workout_name, workout_type, difficulty }
      });
      return response.data.data; // JSend format
   }

   // Tạo bài tập mới
   async create(data: FormData) {
      return (
         await this.API.post('/', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
      ).data;
   }

   // Cập nhật bài tập
   async update(workoutId: number, data: FormData) {
      return (
         await this.API.put(`/${workoutId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
         })
      ).data;
   }

   // Xóa bài tập
   async delete(workoutId: number) {
      return await this.API.delete(`/${workoutId}`);
   }
}

export default new WorkoutService();
