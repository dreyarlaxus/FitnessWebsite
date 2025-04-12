<template>
   <div class="pagination">
      <button
         :disabled="page === 1"
         @click="changePage(page - 1)"
      >
         Previous
      </button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button
         :disabled="page === totalPages"
         @click="changePage(page + 1)"
      >
         Next
      </button>
   </div>
</template>

<script lang="ts">
export default {
   name: 'Pagination',
   props: {
      page: {
         type: Number,
         required: true
      },
      totalPages: {
         type: Number,
         required: true
      }
   },
   emits: ['pageChange'],
   methods: {
      changePage(newPage: any) {
         this.$emit('pageChange', newPage);
      }
   }
};
</script>

<style scoped>
.pagination {
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 10px;
   margin-top: 20px;
}
button {
   padding: 10px;
   background-color: #007bff;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
}
button:disabled {
   background-color: #cccccc;
   cursor: not-allowed;
}
</style>
