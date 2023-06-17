<template>
  <HelloWorld />
  {{ mensaje() }}
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

// Components
import HelloWorld from '../components/HelloWorld.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    HelloWorld,
  },

  methods: {
    mensaje(){
      const instance = axios.create({ baseURL: 'http://localhost:4000'})
      instance.get('/usuario')
      .then(res => {
        console.log(res);
      })
    }
  }
});
</script>
