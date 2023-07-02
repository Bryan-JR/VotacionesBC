<template>
    <div class="about">
    <h2 class="title">POSTULADOS A {{ convocatoria.titulo }}</h2>
    <v-parallax class="panel" max-height="800" src="../../public/img/fondo.png">
      <v-row>
        <VerPostulados :id="id" />
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
import VerPostulados from '../components/VerPostulados.vue';
export default {
    components: { VerPostulados },
    data() {
      return {
        id: this.$route.params.idCon,
        convocatoria: {titulo:''},
      }
    },
    methods: {
      async cargarConvocatoria(){
            await this.axios.get('/convocatoria/'+this.id)
            .then(resp => {
                this.convocatoria = resp.data[0];
            }).
            catch(error => {
                console.log(error);
            });
        },
    },
    async mounted() {
      await this.cargarConvocatoria();
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