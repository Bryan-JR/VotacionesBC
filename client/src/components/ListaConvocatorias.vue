<template>
    <v-container>
        <v-expansion-panels variant="inset" class="my-4">
            <v-expansion-panel
                v-for="(convocatoria, i) in convocatorias"
                :key="i"
            >
            <v-expansion-panel-title> {{ convocatoria.titulo }} <div>{{ convocatoria.fecha_fin }}</div> </v-expansion-panel-title>
            <v-expansion-panel-text> 
                {{ convocatoria.descripcion }}
                <div>Desde {{ convocatoria.fecha_ini }} hasta {{ convocatoria.fecha_fin }}</div>
                <a href="#">PARTICIPAR</a>
            </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>
<script>
export default {
    name: 'ListaConvocatorias',
    data() {
        return {
            convocatorias: []
        }
    },
    methods: {
        cargarConvocatorias(){
            this.axios.get('/convocatoria')
            .then(resp => {
                this.convocatorias = resp.data;
            }).
            catch(error => {
                console.log(error);
            });
        }
    },
    mounted() {
        this.cargarConvocatorias();
    },
}
</script>