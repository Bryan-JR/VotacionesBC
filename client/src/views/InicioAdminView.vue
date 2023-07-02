<template>
  <div class="about">
    <h2 class="title">VOTACIONES PARA REPRESENTANTE ESTUDIANTIL DE LA UNIVERSIDAD DE CÓRDOBA</h2>
    <v-parallax class="panel" src="../../public/img/fondo.png">
      <div class="fila">
        <BotonesAction />
        <BotonCenso />
      </div>
      <v-row>
        <TablaUsuarios />
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
  
  import BotonesAction from '../components/BotonesAction.vue';
  import BotonCenso from '../components/BotonCenso.vue';
  import TablaUsuarios from '../components/TablaUsuarios.vue';
  //import axios from 'axios';
  
  export default {
    components: { BotonesAction, BotonCenso, TablaUsuarios },
    data() {
      return {
      }
    },
  }

</script>

<style scoped>
    .title{
        text-align: center;
        padding: 12px 0;
        margin: 0 30px;
        border-bottom: 3px solid #02a50d;
    }
    .panel{
        margin-top: 20px;
        margin-bottom: 50px;
        padding: 50px;
        max-width: 100%;
        background-size: cover;
        background-position: center; /* Centra la imagen en el contenedor */
        position: sticky;
        
    }
</style>