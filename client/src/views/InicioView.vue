<template>
  <LoginForm />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import LoginForm from '../components/LoginForm.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    LoginForm,
  },
});
</script>
