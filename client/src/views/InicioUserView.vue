<template>
    <div class="about">
    <h2 class="title">VOTACIONES PARA REPRESENTANTE ESTUDIANTIL DE LA UNIVERSIDAD DE CÓRDOBA</h2>
    <div class="panel">
      <v-row class="fila">
        <BotonesAction />
      </v-row>
    </div>
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
    margin: 0 30px;
    border-bottom: 3px solid #02a50d;
  }
  .panel{
    margin-top: 20px;
    margin-bottom: 50px;
    padding: 50px;
    max-width: 100%;
    background-image: url(../../public/img/fondo.png);
    background-size: cover;
    background-position: center; /* Centra la imagen en el contenedor */
    position: sticky;
    height: 34em;
  }
  .fila{
    margin: 0;
    padding: 0;
    gap:20px;
  }
</style>