<template>
   <div class="meals-page">
      <!-- Nút thêm bữa ăn -->
      <button
         class="add-post-button"
         @click="openAddMealModal"
      >
         Add New Meal
      </button>

      <!-- Thanh tìm kiếm -->
      <SearchBar @search="onSearch" />

      <!-- Tiêu đề chính -->
      <h1>Sharing Our Meal Recipes</h1>

      <!-- Danh sách bữa ăn -->
      <div class="meal-list">
         <Card
            v-for="(meal, index) in meals"
            :key="meal.meal_id"
            class="meal-card"
         >
            <CardHeader>
               <h2>{{ meal.meal_name }}</h2>
               <p><strong>Type:</strong> {{ meal.meal_type }}</p>
            </CardHeader>
            <CardContent>
               <p><strong>Calories:</strong> {{ meal.calories }} kcal</p>
               <p><strong>Description:</strong> {{ meal.meal_description }}</p>
               <p><strong>VIP Meal:</strong> {{ meal.meal_vip ? 'Yes' : 'No' }}</p>
            </CardContent>
            <CardFooter class="card-footer">
               <button
                  class="edit-button"
                  @click="openEditMealModal(meal)"
               >
                  Edit
               </button>
               <button
                  class="delete-button"
                  @click="deleteMeal(meal.meal_id)"
               >
                  Delete
               </button>
            </CardFooter>
         </Card>
      </div>

      <!-- Pagination -->
      <Pagination
         :page="page"
         :totalPages="totalPages"
         @pageChange="changePage"
      />

      <!-- Modal thêm bữa ăn -->
      <div
         v-if="showAddMealModal"
         class="modal-overlay"
      >
         <div class="modal">
            <!-- Dấu "X" đóng form -->
            <button
               class="close-button"
               @click="closeAddMealModal"
            >
               &times;
            </button>
            <h2>Add New Meal</h2>
            <form @submit.prevent="confirmAddMeal">
               <div class="form-group">
                  <label>Meal Name:</label>
                  <input
                     v-model="newMeal.meal_name"
                     placeholder="Meal Name"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Meal Type:</label>
                  <input
                     v-model="newMeal.meal_type"
                     placeholder="Meal Type"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Calories:</label>
                  <input
                     v-model.number="newMeal.calories"
                     type="number"
                     placeholder="Calories (kcal)"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Description:</label>
                  <textarea
                     v-model="newMeal.meal_description"
                     placeholder="Meal Description"
                  ></textarea>
               </div>
               <div class="form-group">
                  <label>VIP Meal:</label>
                  <input
                     type="checkbox"
                     v-model="newMeal.meal_vip"
                  />
               </div>
               <div class="modal-footer">
                  <button
                     type="submit"
                     class="confirm-button"
                  >
                     Confirm to Add
                  </button>
               </div>
            </form>
         </div>
      </div>

      <!-- Modal chỉnh sửa bữa ăn -->
      <div
         v-if="showEditMealModal"
         class="modal-overlay"
      >
         <div class="modal">
            <!-- Dấu "X" đóng form -->
            <button
               class="close-button"
               @click="closeEditMealModal"
            >
               &times;
            </button>
            <h2>Edit Meal</h2>
            <form @submit.prevent="confirmEditMeal">
               <div class="form-group">
                  <label>Meal Name:</label>
                  <input
                     v-model="editMeal.meal_name"
                     placeholder="Meal Name"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Meal Type:</label>
                  <input
                     v-model="editMeal.meal_type"
                     placeholder="Meal Type"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Calories:</label>
                  <input
                     v-model.number="editMeal.calories"
                     type="number"
                     placeholder="Calories (kcal)"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Description:</label>
                  <textarea
                     v-model="editMeal.meal_description"
                     placeholder="Meal Description"
                  ></textarea>
               </div>
               <div class="form-group">
                  <label>VIP Meal:</label>
                  <input
                     type="checkbox"
                     v-model="editMeal.meal_vip"
                  />
               </div>
               <div class="modal-footer">
                  <button
                     type="submit"
                     class="confirm-button"
                  >
                     Save Edits
                  </button>
               </div>
            </form>
         </div>
      </div>
   </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import MealService from '@/services/MealService';
import Pagination from '@/components/Pagination.vue';
import SearchBar from '@/components/SearchBar.vue';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default {
   components: { Card, CardHeader, CardContent, CardFooter, Pagination, SearchBar },
   setup() {
      const meals = ref([]);
      const showAddMealModal = ref(false);
      const showEditMealModal = ref(false);
      const page = ref(1);
      const limit = ref(6);
      const totalPages = ref(1);
      const searchQuery = ref('');
      const newMeal = ref({
         meal_name: '',
         meal_type: '',
         calories: 0,
         meal_description: '',
         meal_vip: false
      });
      const editMeal = ref(null);

      const fetchMeals = async () => {
         try {
            const response = await MealService.getAll(page.value, limit.value, searchQuery.value);
            meals.value = response.meals;
            totalPages.value = response.metadata.lastPage;
         } catch (error) {
            console.error('Error fetching meals:', error);
         }
      };

      const changePage = (newPage) => {
         page.value = newPage;
         fetchMeals();
      };

      const onSearch = (query) => {
         searchQuery.value = query;
         page.value = 1;
         fetchMeals();
      };

      const confirmAddMeal = async () => {
         try {
            await MealService.create({ ...newMeal.value });
            fetchMeals();
            closeAddMealModal();
         } catch (error) {
            console.error('Error adding meal:', error);
         }
      };

      const confirmEditMeal = async () => {
         try {
            await MealService.update(editMeal.value.meal_id, { ...editMeal.value });
            fetchMeals();
            closeEditMealModal();
         } catch (error) {
            console.error('Error editing meal:', error);
         }
      };

      const deleteMeal = async (mealId) => {
         if (confirm('Are you sure you want to delete this meal?')) {
            try {
               await MealService.delete(mealId);
               fetchMeals();
            } catch (error) {
               console.error('Error deleting meal:', error);
            }
         }
      };

      const openAddMealModal = () => (showAddMealModal.value = true);
      const closeAddMealModal = () => {
         showAddMealModal.value = false;
         newMeal.value = {
            meal_name: '',
            meal_type: '',
            calories: 0,
            meal_description: '',
            meal_vip: false
         };
      };

      const openEditMealModal = (meal) => {
         editMeal.value = { ...meal };
         showEditMealModal.value = true;
      };
      const closeEditMealModal = () => (showEditMealModal.value = false);

      onMounted(fetchMeals);

      return {
         meals,
         showAddMealModal,
         showEditMealModal,
         page,
         totalPages,
         changePage,
         searchQuery,
         onSearch,
         newMeal,
         editMeal,
         confirmAddMeal,
         confirmEditMeal,
         deleteMeal,
         openAddMealModal,
         closeAddMealModal,
         openEditMealModal,
         closeEditMealModal
      };
   }
};
</script>

<style scoped>
.meals-page {
   background-color: #1e1e2f;
   color: white;
   padding: 20px;
   min-height: 100vh;
}

.add-post-button {
   background-color: #4caf50;
   color: white;
   padding: 12px 24px;
   border-radius: 8px;
   cursor: pointer;
   margin-bottom: 20px;
   font-weight: bold;
   transition: 0.3s ease-in-out;
}

.add-post-button:hover {
   background-color: #45a049;
   transform: scale(1.05);
}

h1 {
   text-align: center;
   font-size: 2.5rem;
   font-weight: bold;
   color: #44cdbf;
   text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
   margin-bottom: 30px;
   line-height: 1.5;
   text-transform: uppercase;
}

h1:hover {
   color: #00ffcc;
   transform: scale(1.05);
   transition: all 0.3s ease-in-out;
}

.meal-list {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: 20px;
}

.meal-card {
   background-color: #2a2a40;
   padding: 20px;
   border-radius: 10px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.meal-card:hover {
   transform: translateY(-5px);
   box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-footer {
   display: flex;
   justify-content: space-between;
}

.edit-button,
.delete-button {
   padding: 10px 20px;
   border-radius: 6px;
   font-weight: bold;
   border: none;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.edit-button {
   background-color: #2196f3;
   color: white;
}

.edit-button:hover {
   background-color: #1976d2;
}

.delete-button {
   background-color: #f44336;
   color: white;
}

.delete-button:hover {
   background-color: #d32f2f;
}

.modal-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.8);
   display: flex;
   justify-content: center;
   align-items: center;
}

.modal {
   background: white;
   padding: 30px;
   border-radius: 12px;
   width: 450px;
   color: black;
   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
   position: relative;
}

.modal h2 {
   text-align: center;
   margin-bottom: 20px;
}

.form-group {
   margin-bottom: 15px;
}

.form-group label {
   display: block;
   font-weight: bold;
   margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
   width: 100%;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 6px;
}

.modal-footer {
   text-align: right;
}

.confirm-button {
   background-color: #4caf50;
   color: white;
   padding: 10px 20px;
   border-radius: 5px;
   border: none;
   cursor: pointer;
   font-weight: bold;
}

.confirm-button:hover {
   background-color: #45a049;
}

.close-button {
   position: absolute;
   top: 10px;
   right: 15px;
   font-size: 24px;
   font-weight: bold;
   color: #333;
   background: none;
   border: none;
   cursor: pointer;
   transition: color 0.3s ease;
}

.close-button:hover {
   color: #f44336;
}
</style>
