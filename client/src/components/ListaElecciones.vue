<template>
    <v-container>
        <v-btn 
            v-if="type==='admin'"
            rounded="lg" 
            color="green" 
            size="large" 
            append-icon="mdi-plus"
            @click="abrir()"
        >
            CREAR ELECCION
            <v-overlay
                location-strategy="connected"
                scroll-strategy="block"
                v-model="overlay"
                class="d-flex justify-center align-center"
            >
                <FormEleccion @listar="cargarElecciones()" :eleccion="eleccion[0]"/>
            </v-overlay>
        </v-btn>
        <v-expansion-panels variant="inset" class="my-4" v-if="mostrar">
            <v-expansion-panel
                v-for="(eleccion, i) in elecciones"
                :key="i"
            >
            <v-expansion-panel-title> {{ eleccion.titulo }} </v-expansion-panel-title>
            <v-expansion-panel-text> 
                <v-card 
                :title="eleccion.titulo" 
                :subtitle="'Desde '+formatFecha(eleccion.fecha_ini)+' hasta '+formatFecha(eleccion.fecha_fin)" 
                :text="eleccion.descripcion">
                    <v-card-actions v-if="type==='admin'">
                        <v-btn color="green" append-icon="mdi-pencil" @click="getEleccion(eleccion.idEleccion)">EDITAR</v-btn>
                        <v-btn color="green" append-icon="mdi-close" @click="eliminar(eleccion.idEleccion)">ELIMINAR</v-btn>
                    </v-card-actions>
                    <v-card-actions v-if="type=='usuario'||type=='admin'">
                        <v-btn color="green" append-icon="mdi-face-recognition" :to="'/elecciones/'+eleccion.idEleccion">VER ELECCIÓN</v-btn>
                    </v-card-actions>
                </v-card>
            </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>
<script>
import FormEleccion from '../components/FormEleccion.vue'

export default {
    name: 'ListaElecciones',
    components: { FormEleccion },
    data() {
        return {
            elecciones: [],
            overlay: false,
            eleccion: [],
            mostrar: false,
            type: JSON.parse(localStorage.getItem("log")).type
        }
    },
    methods: {
        async cargarElecciones(){
            await this.axios.get('/eleccion')
            .then(resp => {
                this.elecciones = resp.data;
                this.elecciones.splice(0,1);
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
                    title: '¿Está seguro de eliminar la elección?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.axios.delete('/eliminar/eleccion/'+id)
                    .then(resp => {
                        console.log(resp);
                        this.$swal.fire('ELIMINADO', 'Elección eliminada correctamente', 'success');
                        this.cargarElecciones();
                    }).
                    catch(error => {
                        console.log(error);
                    });
                } else if (result.isDenied) {
                    this.$swal.fire('CANCELADO', 'No se eliminó la elección', 'info')
                }
            })
        },
        abrir(){
            this.eleccion = [{idEleccion: '', title: '', descripcion: '', fecha_ini: '', fecha_fin: ''}];
            this.overlay = !this.overlay;
        },
        getEleccion(id){
            this.axios.get('/eleccion/'+id)
            .then(resp => {
                this.eleccion = resp.data;
                console.log(this.eleccion);
                this.overlay = true;
            })
            .catch(err => {
                console.log(err);
            });
        }
    },
    async mounted() {
        await this.cargarElecciones();
        await this.$swal.fire({
        title: "Cargando...",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            this.$swal.showLoading()
        }
        }).then((result) => {
        if (result.dismiss === this.$swal.DismissReason.timer) {
            this.mostrar = true;
        }
        })
    },
}
</script>