<template>
   <div class="review-page">
      <!-- Nút thêm bài viết ở góc trên trái -->
      <button
         class="add-post-button"
         @click="openAddPostModal"
      >
         Add New Blog
      </button>

      <!-- Thanh tìm kiếm -->
      <SearchBar @search="onSearch" />

      <!-- Tiêu đề chính nổi bật -->
      <h1>Sharing Our Experienced About Fitness</h1>

      <!-- Danh sách bài viết -->
      <div class="review-list">
         <Card
            v-for="(post, index) in posts"
            :key="post.blog_id"
            class="review-card"
         >
            <CardHeader>
               <h2>{{ post.title }}</h2>
               <p class="owner">Author: {{ post.author }}</p>
            </CardHeader>
            <CardContent>
               <p>{{ post.blog_description }}</p>
               <img
                  v-if="post.blog_image"
                  :src="post.blog_image"
                  alt="Uploaded image"
                  class="uploaded-image"
               />
            </CardContent>
            <CardFooter class="card-footer">
               <template v-if="currentUser && post.author === currentUser.username">
                  <button
                     class="edit-button"
                     @click="openEditPostModal(post)"
                  >
                     Edit
                  </button>
                  <button
                     class="delete-button"
                     @click="deletePost(post.blog_id)"
                  >
                     Delete
                  </button>
               </template>
               <button
                  class="detail-button"
                  @click="showPostDetails(post)"
               >
                  More Details
               </button>
            </CardFooter>
         </Card>
      </div>

      <!-- Phân trang -->
      <Pagination
         :page="page"
         :totalPages="totalPages"
         @pageChange="changePage"
      />

      <!-- Modal hiển thị chi tiết bài viết -->
      <div
         v-if="selectedPost"
         class="modal-overlay"
      >
         <div class="modal">
            <span
               class="close"
               @click="closeModal"
               >&times;</span
            >
            <h2>{{ selectedPost.title }}</h2>
            <p><strong>Author:</strong> {{ selectedPost.author }}</p>
            <p><strong>Description:</strong> {{ selectedPost.blog_description }}</p>
            <p><strong>Content:</strong> {{ selectedPost.content }}</p>
            <img
               v-if="selectedPost.blog_image"
               :src="selectedPost.blog_image"
               alt="Uploaded image"
               class="uploaded-image"
            />
         </div>
      </div>

      <!-- Modal thêm bài viết mới -->
      <div
         v-if="showAddPostModal"
         class="modal-overlay"
      >
         <div class="modal">
            <span
               class="close"
               @click="closeAddPostModal"
               >&times;</span
            >
            <h2>Add New Blog</h2>
            <form @submit.prevent="confirmAddPost">
               <div class="form-group">
                  <label for="title">Title:</label>
                  <input
                     id="title"
                     type="text"
                     v-model="newPost.title"
                  />
               </div>
               <div class="form-group">
                  <label for="blog_description">Description:</label>
                  <textarea
                     id="blog_description"
                     v-model="newPost.blog_description"
                  ></textarea>
               </div>
               <div class="form-group">
                  <label for="content">Content:</label>
                  <textarea
                     id="content"
                     v-model="newPost.content"
                  ></textarea>
               </div>
               <div class="form-group">
                  <label for="blog_image">Image:</label>
                  <input
                     id="blog_image"
                     type="file"
                     @change="onImageChange"
                  />
               </div>
               <button
                  type="submit"
                  class="confirm-button"
               >
                  Confirm to Add
               </button>
            </form>
         </div>
      </div>

      <!-- Modal chỉnh sửa bài viết -->
      <div
         v-if="showEditPostModal"
         class="modal-overlay"
      >
         <div class="modal">
            <span
               class="close"
               @click="closeEditPostModal"
               >&times;</span
            >
            <h2>Edit Blog</h2>
            <form @submit.prevent="confirmEditPost">
               <div class="form-group">
                  <label for="edit-title">Title:</label>
                  <input
                     id="edit-title"
                     type="text"
                     v-model="editPost.title"
                  />
               </div>
               <div class="form-group">
                  <label for="edit-blog_description">Description:</label>
                  <textarea
                     id="edit-blog_description"
                     v-model="editPost.blog_description"
                  ></textarea>
               </div>
               <div class="form-group">
                  <label for="edit-content">Content:</label>
                  <textarea
                     id="edit-content"
                     v-model="editPost.content"
                  ></textarea>
               </div>
               <div class="form-group">
                  <label for="edit-blog_image">Image:</label>
                  <input
                     id="edit-blog_image"
                     type="file"
                     @change="onEditImageChange"
                  />
                  <img
                     v-if="editPost.blog_image && typeof editPost.blog_image === 'string'"
                     :src="editPost.blog_image"
                     alt="Current image"
                     class="uploaded-image"
                  />
               </div>
               <button
                  type="submit"
                  class="confirm-button"
               >
                  Save Edits
               </button>
            </form>
         </div>
      </div>
   </div>
</template>

<script>
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import BlogService from '@/services/BlogService';
import Pagination from '@/components/Pagination.vue';
import SearchBar from '@/components/SearchBar.vue';
import { useCurrentUserStore } from '@/stores/currentUserStore';
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'Review',
   components: {
      Card,
      CardHeader,
      CardContent,
      CardFooter,
      Pagination,
      SearchBar
   },
   data() {
      return {
         posts: [],
         page: 1,
         limit: 6,
         totalPages: 1,
         searchQuery: '',
         selectedPost: null,
         showAddPostModal: false,
         showEditPostModal: false,
         newPost: {
            title: '',
            blog_description: '',
            content: '',
            blog_image: null
         },
         editPost: null,
         currentUser: null,
         currentUserStore: useCurrentUserStore()
      };
   },
   methods: {
      async fetchBlogs() {
         try {
            const response = await BlogService.getAll(this.page, this.limit, this.searchQuery);
            console.log('Fetched Blogs:', response);
            this.posts = response.blogs;
            this.totalPages = response.metadata.lastPage;
         } catch (error) {
            console.error('Error fetching blogs:', error);
            alert('Failed to fetch blogs. Please try again.');
         }
      },
      confirmAddPost() {
         const formData = new FormData();
         formData.append('title', this.newPost.title);
         formData.append('blog_description', this.newPost.blog_description);
         formData.append('content', this.newPost.content);
         formData.append('author', this.currentUser.username);

         if (this.newPost.blog_image) {
            formData.append('blog_image_file', this.newPost.blog_image);
         }

         BlogService.create(formData)
            .then(() => {
               alert('Blog added successfully!');
               this.fetchBlogs();
               this.closeAddPostModal();
            })
            .catch((error) => {
               console.error('Error adding blog:', error);
               alert('Failed to add blog. Please try again.');
            });
      },
      confirmEditPost() {
         const formData = new FormData();
         formData.append('title', this.editPost.title || '');
         formData.append('blog_description', this.editPost.blog_description || '');
         formData.append('content', this.editPost.content || '');
         formData.append('author', this.currentUser.username || '');

         if (this.editPost.blog_image instanceof File) {
            formData.append('blog_image_file', this.editPost.blog_image);
         } else if (typeof this.editPost.blog_image === 'string') {
            formData.append('blog_image', this.editPost.blog_image);
         }

         console.log('Edit Data Sent:', formData);
         console.log('FormData Content:');
         for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
         }
         BlogService.update(this.editPost.blog_id, formData)
            .then(() => {
               alert('Blog updated successfully!');
               this.fetchBlogs();
               this.closeEditPostModal();
            })
            .catch((error) => {
               console.error('Error updating blog:', error);
               alert('Failed to update blog. Please try again.');
            });
      },
      openEditPostModal(post) {
         this.editPost = { ...post };
         console.log('Opening Edit Modal for Post:', this.editPost);
         this.showEditPostModal = true;
      },
      closeEditPostModal() {
         this.showEditPostModal = false;
         this.editPost = null;
      },
      deletePost(blogId) {
         const confirmDelete = confirm('Are you sure you want to delete this blog?');
         if (!confirmDelete) return;

         BlogService.delete(blogId)
            .then(() => {
               this.fetchBlogs();
            })
            .catch((error) => {
               console.error('Error deleting blog:', error);
               alert('Failed to delete blog. Please try again.');
            });
      },
      changePage(newPage) {
         this.page = newPage;
         this.fetchBlogs();
      },
      onSearch(query) {
         this.searchQuery = query;
         this.page = 1;
         this.fetchBlogs();
      },
      showPostDetails(post) {
         this.selectedPost = post;
      },
      closeModal() {
         this.selectedPost = null;
      },
      openAddPostModal() {
         this.showAddPostModal = true;
      },
      closeAddPostModal() {
         this.showAddPostModal = false;
         this.resetNewPost();
      },
      resetNewPost() {
         this.newPost = {
            title: '',
            blog_description: '',
            content: '',
            blog_image: null
         };
      },
      onImageChange(e) {
         const file = e.target.files[0];
         if (file) {
            this.newPost.blog_image = file;
         }
      },
      onEditImageChange(e) {
         const file = e.target.files[0];
         if (file) {
            this.editPost.blog_image = file;
         }
      }
   },
   async mounted() {
      this.currentUser = this.currentUserStore.currentUser;
      await this.fetchBlogs();
   }
});
</script>

<style scoped>
/* Toàn trang */
.review-page {
   background-color: #1e1e2f;
   color: #ffffff;
   padding: 20px;
   min-height: 100vh;
   position: relative;
}

/* Nút thêm bài viết */
.add-post-button {
   position: absolute;
   top: 20px;
   left: 20px;
   background-color: #4caf50;
   color: #ffffff;
   border: none;
   padding: 12px 24px;
   border-radius: 8px;
   font-size: 16px;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.add-post-button:hover {
   background-color: #00ff0d;
}

/* Tiêu đề chính */
h1 {
   text-align: center;
   margin-bottom: 40px;
   font-size: 3rem;
   color: #44cdbf;
   font-weight: bold;
   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

/* Card Styles */
.review-list {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: 20px;
   max-width: 1200px;
   margin: 0 auto;
}

.review-card {
   background-color: #2a2a40;
   border-radius: 10px;
   box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
   padding: 20px;
   color: #d1d5db;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover {
   transform: translateY(-5px);
   box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

/* Footer với nút ở góc bên phải */
.card-footer {
   display: flex;
   justify-content: flex-end;
   gap: 10px;
}

.delete-button {
   background-color: #f44336;
   color: #ffffff;
   border: none;
   padding: 10px 15px;
   border-radius: 6px;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.delete-button:hover {
   background-color: #d32f2f;
}

.detail-button,
.edit-button {
   background-color: #007bff;
   color: #ffffff;
   border: none;
   padding: 10px 15px;
   border-radius: 6px;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.edit-button {
   background-color: #4caf50;
}

.detail-button:hover,
.edit-button:hover {
   background-color: #0056b3;
}

/* Modal Styles */
.modal-overlay {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.8);
   display: flex;
   justify-content: center;
   align-items: center;
}

.modal {
   background-color: #fff;
   color: #000;
   padding: 30px;
   border-radius: 12px;
   width: 450px;
   position: relative;
}

.close {
   position: absolute;
   top: 10px;
   right: 15px;
   font-size: 28px;
   cursor: pointer;
   color: #333;
}

.close:hover {
   color: #f44336;
}

/* Định dạng form nhập liệu */
.form-group input,
.form-group textarea {
   width: 100%;
   padding: 12px;
   border: 1px solid #b0bec5;
   border-radius: 8px;
   font-size: 15px;
   background-color: #ffffff;
   color: #000000;
   transition: background-color 0.3s ease, border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
   outline: none;
   border-color: #64b5f6;
   background-color: #ffffff;
}

.form-group textarea {
   height: 120px;
   resize: none;
}

/* Nút upload file */
.form-group input[type='file'] {
   background-color: #ffffff;
   color: #000000;
   padding: 8px;
   border: none;
}

.form-group input[type='file']::-webkit-file-upload-button {
   background-color: #42a5f5;
   color: #fff;
   border: none;
   padding: 10px 15px;
   border-radius: 6px;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.form-group input[type='file']::-webkit-file-upload-button:hover {
   background-color: #1e88e5;
}

/* Hình ảnh tải lên */
.uploaded-image {
   width: 100%;
   height: auto;
   margin-top: 15px;
   border-radius: 6px;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.uploaded-image:hover {
   transform: scale(1.05);
   box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
}

/* Footer của modal */
.modal-footer {
   text-align: right;
   margin-top: 30px;
}

.confirm-button {
   background-color: #007bff;
   color: #fff;
   border: none;
   padding: 10px 20px;
   border-radius: 6px;
   cursor: pointer;
   transition: background-color 0.3s ease;
}

.confirm-button:hover {
   background-color: #0056b3;
}

.cancel-button {
   background-color: #f44336;
   color: #fff;
   border: none;
   padding: 10px 20px;
   border-radius: 6px;
   cursor: pointer;
   margin-left: 10px;
   transition: background-color 0.3s ease;
}

.cancel-button:hover {
   background-color: #e53935;
}

/* Responsive thiết kế */
@media (max-width: 768px) {
   .review-list {
      grid-template-columns: repeat(2, 1fr);
   }

   .modal {
      width: 90%;
   }

   h1 {
      font-size: 2.5rem;
   }
}

@media (max-width: 480px) {
   .review-list {
      grid-template-columns: 1fr;
   }

   h1 {
      font-size: 2rem;
   }

   .add-post-button {
      padding: 10px 20px;
      font-size: 14px;
   }

   .modal {
      padding: 20px;
   }

   .confirm-button,
   .cancel-button {
      padding: 8px 15px;
   }
}
</style>
