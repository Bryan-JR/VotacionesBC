<template>
  <div class="d-flex flex-row">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" md="7">
            <div>
              <h2 class="mt-8">VOTE DE MANERA SEGURA CON LA TECNOLOGIA BLOCKCHAIN</h2>
              <v-img src="../img/image2.png"></v-img>
            </div>
          </v-col>
          <v-col cols="12" md="5">
            <div>
              <LoginForm @cargar="$emit('cargar')" />
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters class="d-flex" justify="start">
          <v-col cols="12" md="7">
            <v-sheet :elevation="18" border rounded class="pa-4 mt-10">
              <h4 class="text-red">IMPORTANTE</h4>
              <p>
                Para uso de nuestra aplicación web es necesario tener instalada la extensión de MetaMask, crear una billetera y tener Ethereum.
                <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related">
                  Descargar la extensión
                </a>
              </p>
            </v-sheet>
            <v-img src="../img/image3.png" class="mt-10" :height="150" rounded></v-img>
          </v-col>
          <v-col cols="12" md="5" class="ma-0">
            <v-img src="../img/image4.png" class="mx-5" :height="auto"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import LoginForm from '../components/LoginForm.vue';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      usuario: {}
    }
  },
  components: {
    LoginForm,
  },
  methods: {
    
  },
});
</script>
