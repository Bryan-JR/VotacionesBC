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
    async mensaje(){
      const usuario = {
        identificacion: 641054863,
        nombre: "Sebastian",
        apellido1: "Ruiz",
        apellido2: "Sierra",
        contraseña: "Sr.641054863",
        numero_celular: "304 678 9231"
      }

      const data = {
        tabla: "usuario",
        keys: Object.keys(usuario),
        values: Object.values(usuario)
      }
      const instance = axios.create({ baseURL: 'http://localhost:4000'})
      await instance.post('/guardar', data)
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
      
      await instance.get('/usuario/641054863')
      .then( res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });

      usuario.nombre = "Juan";
      data.values = Object.values(usuario);

      await instance.put('/actualiza/641054863', data)
      .then( res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });

      await instance.get('/usuario/641054863')
      .then( res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });

      await instance.delete('/eliminar/usuario/641054863')
      .then( res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });

    }
  }
});
</script>
