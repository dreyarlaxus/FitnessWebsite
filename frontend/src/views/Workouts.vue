<template>
   <div class="workouts-page">
      <!-- Nút thêm bài tập -->
      <button
         class="add-post-button"
         @click="openAddWorkoutModal"
      >
         Add New Workout
      </button>

      <!-- Thanh tìm kiếm -->
      <SearchBar @search="onSearch" />

      <!-- Tiêu đề chính -->
      <h1>Sharing Our Workouts for Fitness</h1>

      <!-- Danh sách bài tập -->
      <div class="workout-list">
         <Card
            v-for="(workout, index) in workouts"
            :key="workout.workout_id"
            class="workout-card"
         >
            <CardHeader>
               <h2>{{ workout.workout_name }}</h2>
               <p class="owner"><strong>Type:</strong> {{ workout.workout_type }}</p>
            </CardHeader>
            <CardContent>
               <p><strong>Difficulty:</strong> {{ workout.difficulty }}</p>
               <p><strong>Equipment:</strong> {{ workout.equipment }}</p>
               <p><strong>Burn Estimate:</strong> {{ workout.burn_estimate }} kcal</p>
               <video
                  v-if="workout.tutorial_video"
                  controls
                  class="tutorial-video"
               >
                  <source
                     :src="workout.tutorial_video"
                     type="video/mp4"
                  />
                  Your browser does not support the video tag.
               </video>
            </CardContent>
            <CardFooter class="card-footer">
               <button
                  class="edit-button"
                  @click="openEditWorkoutModal(workout)"
               >
                  Edit
               </button>
               <button
                  class="delete-button"
                  @click="deleteWorkout(workout.workout_id)"
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

      <!-- Modal thêm bài tập -->
      <div
         v-if="showAddWorkoutModal"
         class="modal-overlay"
      >
         <div class="modal">
            <span
               class="close"
               @click="closeAddWorkoutModal"
               >&times;</span
            >
            <h2>Add New Workout</h2>
            <form @submit.prevent="confirmAddWorkout">
               <div class="form-group">
                  <label>Workout Name:</label>
                  <input
                     v-model="newWorkout.workout_name"
                     placeholder="Workout Name"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Workout Type:</label>
                  <input
                     v-model="newWorkout.workout_type"
                     placeholder="Workout Type"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Difficulty (0-5):</label>
                  <input
                     v-model.number="newWorkout.difficulty"
                     type="number"
                     min="0"
                     max="5"
                     placeholder="Difficulty (0-5)"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Equipment Needed:</label>
                  <input
                     v-model="newWorkout.equipment"
                     placeholder="Equipment Needed"
                  />
               </div>
               <div class="form-group">
                  <label>Burn Estimate (kcal):</label>
                  <input
                     v-model.number="newWorkout.burn_estimate"
                     type="number"
                     placeholder="Burn Estimate (kcal)"
                  />
               </div>
               <div class="form-group">
                  <label>Tutorial Video:</label>
                  <input
                     type="file"
                     @change="onVideoChange"
                     accept="video/mp4"
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

      <!-- Modal chỉnh sửa bài tập -->
      <div
         v-if="showEditWorkoutModal"
         class="modal-overlay"
      >
         <div class="modal">
            <span
               class="close"
               @click="closeEditWorkoutModal"
               >&times;</span
            >
            <h2>Edit Workout</h2>
            <form @submit.prevent="confirmEditWorkout">
               <div class="form-group">
                  <label>Workout Name:</label>
                  <input
                     v-model="editWorkout.workout_name"
                     placeholder="Workout Name"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Workout Type:</label>
                  <input
                     v-model="editWorkout.workout_type"
                     placeholder="Workout Type"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Difficulty (0-5):</label>
                  <input
                     v-model.number="editWorkout.difficulty"
                     type="number"
                     min="0"
                     max="5"
                     placeholder="Difficulty (0-5)"
                     required
                  />
               </div>
               <div class="form-group">
                  <label>Equipment Needed:</label>
                  <input
                     v-model="editWorkout.equipment"
                     placeholder="Equipment Needed"
                  />
               </div>
               <div class="form-group">
                  <label>Burn Estimate (kcal):</label>
                  <input
                     v-model.number="editWorkout.burn_estimate"
                     type="number"
                     placeholder="Burn Estimate (kcal)"
                  />
               </div>
               <div class="form-group">
                  <label>Tutorial Video:</label>
                  <input
                     type="file"
                     @change="onEditVideoChange"
                     accept="video/mp4"
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
import WorkoutService from '@/services/WorkoutService';
import Pagination from '@/components/Pagination.vue';
import SearchBar from '@/components/SearchBar.vue';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export default {
   components: { Card, CardHeader, CardContent, CardFooter, Pagination, SearchBar },
   setup() {
      const workouts = ref([]);
      const showAddWorkoutModal = ref(false);
      const showEditWorkoutModal = ref(false);
      const page = ref(1);
      const limit = ref(6);
      const totalPages = ref(1);
      const searchQuery = ref('');
      const newWorkout = ref({
         workout_name: '',
         workout_type: '',
         difficulty: 0,
         equipment: '',
         burn_estimate: 0,
         tutorial_video_file: null
      });
      const editWorkout = ref(null);

      const fetchWorkouts = async () => {
         try {
            const response = await WorkoutService.getAll(
               page.value,
               limit.value,
               searchQuery.value
            );
            workouts.value = response.workouts;
            // if (workouts.value) {
            //    workouts.value.forEach((workout) => {
            //       workout.tutorial_video = workout.tutorial_video.replace('/public', '');
            //    });
            // }
            console.log(workouts.value);
            totalPages.value = response.metadata.lastPage;
         } catch (error) {
            console.error('Error fetching workouts:', error);
         }
      };

      const changePage = (newPage) => {
         page.value = newPage;
         fetchWorkouts();
      };

      const onSearch = (query) => {
         searchQuery.value = query;
         page.value = 1;
         fetchWorkouts();
      };

      const confirmAddWorkout = async () => {
         try {
            const formData = new FormData();
            for (let key in newWorkout.value) {
               if (newWorkout.value[key]) formData.append(key, newWorkout.value[key]);
            }
            await WorkoutService.create(formData);
            fetchWorkouts();
            closeAddWorkoutModal();
         } catch (error) {
            console.error('Error adding workout:', error);
         }
      };

      const confirmEditWorkout = async () => {
         try {
            const formData = new FormData();
            for (let key in editWorkout.value) {
               if (editWorkout.value[key]) formData.append(key, editWorkout.value[key]);
            }
            await WorkoutService.update(editWorkout.value.workout_id, formData);
            fetchWorkouts();
            closeEditWorkoutModal();
         } catch (error) {
            console.error('Error editing workout:', error);
         }
      };

      const deleteWorkout = async (id) => {
         if (confirm('Are you sure?')) {
            try {
               await WorkoutService.delete(id);
               fetchWorkouts();
            } catch (error) {
               console.error('Error deleting workout:', error);
            }
         }
      };

      const openAddWorkoutModal = () => (showAddWorkoutModal.value = true);
      const closeAddWorkoutModal = () => {
         showAddWorkoutModal.value = false;
         newWorkout.value = {
            workout_name: '',
            workout_type: '',
            difficulty: 0,
            equipment: '',
            burn_estimate: 0,
            tutorial_video_file: null
         };
      };

      const openEditWorkoutModal = (workout) => {
         editWorkout.value = { ...workout };
         showEditWorkoutModal.value = true;
      };

      const closeEditWorkoutModal = () => (showEditWorkoutModal.value = false);
      const onVideoChange = (e) => (newWorkout.value.tutorial_video_file = e.target.files[0]);
      const onEditVideoChange = (e) => (editWorkout.value.tutorial_video_file = e.target.files[0]);

      onMounted(fetchWorkouts);

      return {
         workouts,
         showAddWorkoutModal,
         showEditWorkoutModal,
         page,
         totalPages,
         changePage,
         searchQuery,
         onSearch,
         newWorkout,
         editWorkout,
         confirmAddWorkout,
         confirmEditWorkout,
         deleteWorkout,
         openAddWorkoutModal,
         closeAddWorkoutModal,
         openEditWorkoutModal,
         closeEditWorkoutModal,
         onVideoChange,
         onEditVideoChange
      };
   }
};
</script>

<style scoped>
.workouts-page {
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
.workout-list {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: 20px;
}

.workout-card {
   background-color: #2a2a40;
   padding: 20px;
   border-radius: 10px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.workout-card:hover {
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

.form-group input {
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

.close {
   position: absolute;
   top: 10px;
   right: 15px;
   font-size: 20px;
   cursor: pointer;
   color: #333;
}

.close:hover {
   color: #f44336;
}
</style>
