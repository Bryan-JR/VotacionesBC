<template>
    <v-card
    class="mx-auto my-16 pa-4 d-flex flex-column justify-center aling-center"
    width="700"
  >
    <v-card-title class="title">ELECCIÓN</v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="form">
            <v-row>
                <v-select
                label="TITULO DE LA ELECCIÓN"
                :items="titulos"
                v-model="titulo"
                ></v-select>
            </v-row>
            <v-row>
                <v-textarea
                counter
                label="DESCRIPCION"
                v-model="descripcion"
                placeholder="Añade una descripción..."
                ></v-textarea>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                    label="FECHA FINALIZACIÓN"
                    type="date"
                    v-model="fecha_fin"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col v-if="eleccion.idEleccion==''">
                    <v-btn
                    variant="text"
                    class="mt-4"
                    block
                    color="teal-accent-4"
                    @click="guardarEleccion"
                    >
                    GUARDAR
                    </v-btn>  
                </v-col>
                <v-col v-else>
                    <v-btn
                    variant="text"
                    class="mt-4"
                    block
                    color="yellow"
                    @click="modificar(eleccion)"
                    >
                    MODIFICAR
                    </v-btn>  
                </v-col>
            </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: 'FormEleccion',
    props: [ 'eleccion'],
    data(){
        return {
            titulos: [ 
                'ELECCIÓN A REPRESENTANTE ESTUDIANTIL',
                'ELECCIÓN A REPRESENTANTE DE LA FACULTAD DE INGENIERÍA',
                'ELECCIÓN A REPRESENTANTE DE LA FACULTAD DE CIENCIAS DE LA SALUD',
                'ELECCIÓN A REPRESENTANTE DE LA FACULTAD DE MEDICINA VETERINARIA Y ZOOTECNIA',
                'ELECCIÓN A REPRESENTANTE DE LA FACULTAD DE CIENCIAS AGRICOLAS',
                'ELECCIÓN A REPRESENTANTE DE LA FACULTAD DE CIENCIAS BÁSICAS',
                'ELECCIÓN A REPRESENTANTE DE LA FACULTAD DE EDUCACIÓN Y CIENCIAS HUMANAS',
                'ELECCIÓN A REPRESENTANTE DE LA FACULTAD DE CIENCIAS ECONOMICAS, JURIDICAS Y ADMINITRATIVAS'
            ],
            titulo: this.eleccion.titulo,
            rulesDes: [v => v.length <= 2000 || 'Max 2000 characters'],
            descripcion: this.eleccion.descripcion,
            fecha_fin: this.eleccion.fecha_fin.substring(0, 10),
        }
    },
    methods: {
        guardarEleccion(){
            let fecha = new Date();
            fecha = fecha.getFullYear()+"-"+fecha.getMonth()+"-"+fecha.getDate();
            let eleccion = {
                titulo: this.titulo,
                descripcion: this.descripcion,
                fecha_ini: fecha,
                fecha_fin: this.fecha_fin
            }
            const body = {
                tabla: "eleccion",
                keys: Object.keys(eleccion),
                values: Object.values(eleccion)
            }
            this.axios.post('/guardar', body)
            .then(resp => {
                console.log(resp.data);
                this.$emit('listar');
                this.setModelo("", "", "");
                this.$swal.fire({
                    icon: 'success',
                    title: 'Elección creada',
                    text: 'Se guardó correctamente la elección'
                });
            })
            .catch(err => {
                this.$swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: err.data
                });
            });
        },
        setModelo(tit, des, fin){
            this.titulo = tit;
            this.descripcion = des;
            this.fecha_fin = fin;
        },
        modificar(data){
            let datos = data;
            datos.titulo = this.titulo;
            datos.descripcion = this.descripcion;
            datos.fecha_ini = datos.fecha_ini.substring(0, 10);
            datos.fecha_fin = this.fecha_fin;
            const body = {
                tabla: 'eleccion',
                keys: Object.keys(datos),
                values: Object.values(datos)
            }
            this.$emit('overlay');
            this.$swal.fire({
                    icon: 'question',
                    title: '¿Está seguro de modificar la elección?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.put('/actualiza/'+datos.idEleccion, body)
                    .then(resp => {
                        console.log(resp);
                        this.setModelo("", "", "");
                        this.$swal.fire('MODIFICADO', 'Se modificó la elección', 'success');
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else if (result.isDenied) {
                    this.$swal.fire('CANCELADO', 'No se modificó la elección', 'info');
                }
            });
            this.$emit('listar');
            
        },
    },
    
}
</script>

<style scoped>
    .title{
        text-align: center;
        padding: 10px 0;
        margin: 0 30px 15px;
        border-bottom: 3px solid #02a50d;
    }
</style>