<template>
    <v-container>
        <v-btn 
            rounded="lg" 
            color="green" 
            size="large" 
            append-icon="mdi-plus"
            @click="convocatoria = [{idConvocatoria: '', title: '', descripcion: '', fecha_ini: '', fecha_fin: '', nCandidato: ''}];"
        >
            AÑADIR CONVOCATORIA
            <v-overlay
                activator="parent"
                location-strategy="connected"
                scroll-strategy="block"
                v-model="overlay"
            >
                <FormConvocatoria @overlay="overlay=false" @listar="cargarConvocatorias()" :convocatoria="convocatoria[0]"/>
            </v-overlay>
        </v-btn>
        <v-expansion-panels variant="inset" class="my-4">
            <v-expansion-panel
                v-for="(convocatoria, i) in convocatorias"
                :key="i"
            >
            <v-expansion-panel-title> {{ convocatoria.titulo }} </v-expansion-panel-title>
            <v-expansion-panel-text> 
                <v-card 
                :title="convocatoria.titulo" 
                :subtitle="'Desde '+formatFecha(convocatoria.fecha_ini)+' hasta '+formatFecha(convocatoria.fecha_fin)" 
                :text="convocatoria.descripcion">
                    <v-card-actions>
                        <v-btn color="green" append-icon="mdi-face-recognition">VER POSTULADOS</v-btn>
                        <v-btn color="green" append-icon="mdi-pencil" @click="getConvocatoria(convocatoria.idConvocatoria)">EDITAR</v-btn>
                        <v-btn color="green" append-icon="mdi-close" @click="eliminar(convocatoria.idConvocatoria)">ELIMINAR</v-btn>
                    </v-card-actions>
                </v-card>
            </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>
<script>
import FormConvocatoria from '../components/FormConvocatoria.vue'

export default {
    name: 'ListaConvocatorias',
    components: { FormConvocatoria },
    data() {
        return {
            convocatorias: [],
            overlay: false,
            convocatoria: [],
        }
    },
    methods: {
        cargarConvocatorias(){
            this.axios.get('/convocatoria')
            .then(resp => {
                this.convocatorias = resp.data;
                this.overlay = false;
            }).
            catch(error => {
                console.log(error);
            });
        },
        formatFecha(fecha) {
            const dateObj = new Date(fecha);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            
            return `${day}/${month}/${year}`;
        },
        eliminar(id){
            this.$swal.fire({
                    icon: 'question',
                    title: '¿Está seguro de eliminar la convocatoria?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.axios.delete('/eliminar/convocatoria/'+id)
                    .then(resp => {
                        console.log(resp);
                        this.$swal.fire('ELIMINADO', 'Convocatoria eliminada correctamente', 'success');
                        this.cargarConvocatorias();
                    }).
                    catch(error => {
                        console.log(error);
                    });
                } else if (result.isDenied) {
                    this.$swal.fire('CANCELADO', 'No se eliminó la convocatoria', 'info')
                }
            })
        },
        getConvocatoria(id){
            this.axios.get('/convocatoria/'+id)
            .then(resp => {
                this.convocatoria = resp.data;
                console.log(this.convocatoria);
                this.overlay = true;
            })
            .catch(err => {
                console.log(err);
            });
        }
    },
    mounted() {
        this.cargarConvocatorias();
    },
}
</script>