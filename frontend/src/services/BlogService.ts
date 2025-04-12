import axiosInstance from './APIService';

class BlogService {
   API: any;
   constructor(baseURL = 'http://localhost:3000/blog') {
      this.API = axiosInstance(baseURL);
   }

   // Lấy danh sách tất cả các blog với phân trang và tìm kiếm
   async getAll(page = 1, limit = 6, title = '', author = '') {
      const response = await this.API.get('/', {
         params: {
            page,
            limit,
            title,
            author
         }
      });
      return response.data.data; // Phần dữ liệu từ JSend
   }

   // Tạo blog mới
   async create(data: FormData) {
      return (
         await this.API.post('/', data, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         })
      ).data;
   }

   // Xóa blog dựa trên blogId
   async delete(blogId: number) {
      return await this.API.delete(`/${blogId}`);
   }

   // Cập nhật blog
   async update(blogId: number, data: any) {
      // console.log(data);
      // const formData = new FormData();
      // formData.append('title', data.title);
      // formData.append('blog_description', data.blog_description);
      // formData.append('content', data.content);
      // formData.append('author', data.author);

      // if (data.blog_image instanceof File) {
      //    formData.append('blog_image_file', data.blog_image);
      // }
      // console.log(formData.values);
      return await this.API.put(`/${blogId}`, data, {
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      });
   }
}

export default new BlogService();
