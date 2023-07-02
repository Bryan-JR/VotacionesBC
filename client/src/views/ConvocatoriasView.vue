<template>
    <div class="about">
    <h2 class="title">CONVOCATORIAS</h2>
    <v-parallax class="panel" max-height="800" src="../../public/img/fondo.png">
      <v-row>
        <ListaConvocatorias />
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
import ListaConvocatorias from '../components/ListaConvocatorias.vue';
export default {
    components: { ListaConvocatorias }
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