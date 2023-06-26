<template>
  <div class="about">
    <h2 class="title">VOTACIONES PARA REPRESENTANTE ESTUDIANTIL DE LA UNIVERSIDAD DE CÓRDOBA</h2>
    <div class="panel">
      <div class="fila">
        <BotonesAction />
        <BotonCenso />
      </div>
      <v-row>
        <TablaUsuarios />
      </v-row>
    </div>
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
  
</style>
