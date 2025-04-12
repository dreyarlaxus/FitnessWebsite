<template>
   <div class="search-bar">
      <input
         type="text"
         v-model="searchQuery"
         placeholder="Search by title or author..."
      />
      <button @click="onSearch">Search</button>
   </div>
</template>

<script lang="ts">
export default {
   name: 'SearchBar',
   data() {
      return {
         searchQuery: ''
      };
   },
   emits: ['search'],
   methods: {
      onSearch() {
         this.$emit('search', this.searchQuery);
      }
   }
};
</script>

<style scoped>
.search-bar {
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 10px;
   margin-bottom: 20px;
}
input {
   padding: 12px 16px;
   width: 60%;
   border: 1px solid #44cdbf;
   border-radius: 5px;
   font-size: 16px;
   background-color: #2a2a40;
   color: #d1d5db;
   transition: all 0.3s ease;
}

input:focus {
   outline: none;
   border-color: #64f2e8;
   background-color: #1e1e2f;
   color: #ffffff;
}

button {
   padding: 12px 16px;
   background-color: #44cdbf;
   color: white;
   border: none;
   border-radius: 5px;
   font-size: 16px;
   cursor: pointer;
   transition: all 0.3s ease;
}

button:hover {
   background-color: #36a8a3;
}
</style>
