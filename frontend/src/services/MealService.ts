import axios from 'axios';

const API_URL = 'http://localhost:3000/meals';

class MealService {
   // Lấy danh sách meals
   async getAll(page = 1, limit = 6, searchQuery = '') {
      console.log('Fetching meals with:', { page, limit, searchQuery });
      const response = await axios.get(API_URL, {
         params: { page, limit, meal_name: searchQuery }
      });
      return response.data.data;
   }

   // Thêm mới một meal
   async create(meal: any) {
      const response = await axios.post(API_URL, meal, {
         headers: {
            'Content-Type': 'application/json'
         }
      });
      return response.data.data;
   }

   async update(mealId: number, meal: any) {
      // Log dữ liệu trước khi gửi
      console.log('Meal to update:', meal);

      // Gửi dữ liệu dưới dạng JSON
      const response = await axios.put(`${API_URL}/${mealId}`, meal, {
         headers: {
            'Content-Type': 'application/json'
         }
      });

      return response.data.data;
   }

   // Xóa meal
   async delete(mealId: number) {
      console.log('Deleting meal with ID:', mealId);
      await axios.delete(`${API_URL}/${mealId}`);
   }
}

export default new MealService();
