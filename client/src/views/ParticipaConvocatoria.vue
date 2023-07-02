<template>
    <div class="about">
        <h2 class="title">{{ convocatoria.titulo }}</h2>
        <v-parallax class="panel" src="../../public/img/fondo.png">
        <v-row>
            <ConvocatoriaInfo @carga="carga()" :convocatoria="convocatoria"/>
        </v-row>
        </v-parallax>
    </div>
</template>

<script>
import ConvocatoriaInfo from '../components/ConvocatoriaInfo.vue'
export default {
   components: { ConvocatoriaInfo },
   data() {
        return {
            convocatoria: {},
        }
    },
    methods: {
        carga(){
            this.axios.get('/convocatoria/'+this.$route.params.id)
        .then(resp => {
            this.convocatoria = resp.data[0];
        })
        .catch(err => {
            console.log(err);
        });
        }
   }, 
   mounted() {
       this.carga();
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