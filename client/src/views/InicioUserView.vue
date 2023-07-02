<template>
    <div class="about">
    <h2 class="title">VOTACIONES PARA REPRESENTANTE ESTUDIANTIL DE LA UNIVERSIDAD DE CÓRDOBA</h2>
    <v-parallax class="panel" max-height="800" src="../../public/img/fondo.png">
      <v-row class="fila">
        <BotonesAction />
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
import BotonesAction from '../components/BotonesAction.vue';


export default {
    components: { BotonesAction }
}
</script>

<style scoped>
  .title{
    text-align: center;
    padding: 12px 0;
    margin: 0 30px 20px;
    border-bottom: 3px solid #02a50d;
  }
  .fila{
    margin: 0;
    padding: 0;
    gap:20px;
  }
</style>