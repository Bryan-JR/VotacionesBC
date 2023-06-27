<template>
    <v-card
    class="mx-auto my-16 pa-4 d-flex flex-column justify-center aling-center"
    width="700"
  >
    <v-card-title class="title">CONVOCATORIA</v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="form">
            <v-row>
                <v-select
                label="TITULO DE CONVOCATORIA"
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
                <v-col>
                    <v-text-field
                    label="NÚMERO DE PARTICIPANTES"
                    type="number"
                    v-model="nCandidatos"
                    min="0"
                    max="100"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col v-if="convocatoria.idConvocatoria==''">
                    <v-btn
                    variant="text"
                    class="mt-4"
                    block
                    color="teal-accent-4"
                    @click="guardarConvocatoria"
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
                    @click="modificar(convocatoria)"
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
    name: 'OverlayConvocatoria',
    props: [ 'convocatoria'],
    data(){
        return {
            titulos: [ 
                'CONVOCATORIA A REPRESENTANTE ESTUDIANTIL',
                'CONVOCATORIA A REPRESENTANTE DE LA FACULTAD DE INGENIERÍA',
                'CONVOCATORIA A REPRESENTANTE DE LA FACULTAD DE CIENCIAS DE LA SALUD',
                'CONVOCATORIA A REPRESENTANTE DE LA FACULTAD DE MEDICINA VETERINARIA Y ZOOTECNIA',
                'CONVOCATORIA A REPRESENTANTE DE LA FACULTAD DE CIENCIAS AGRICOLAS',
                'CONVOCATORIA A REPRESENTANTE DE LA FACULTAD DE CIENCIAS BÁSICAS',
                'CONVOCATORIA A REPRESENTANTE DE LA FACULTAD DE EDUCACIÓN Y CIENCIAS HUMANAS',
                'CONVOCATORIA A REPRESENTANTE DE LA FACULTAD DE CIENCIAS ECONOMICAS, JURIDICAS Y ADMINITRATIVAS'
            ],
            titulo: this.convocatoria.titulo,
            rulesDes: [v => v.length <= 2000 || 'Max 2000 characters'],
            descripcion: this.convocatoria.descripcion,
            fecha_fin: this.convocatoria.fecha_fin.substring(0, 10),
            nCandidatos: this.convocatoria.nCandidatos,
        }
    },
    methods: {
        guardarConvocatoria(){
            let fecha = new Date();
            fecha = fecha.getFullYear()+"-"+fecha.getMonth()+"-"+fecha.getDate();
            let convocatoria = {
                titulo: this.titulo,
                descripcion: this.descripcion,
                fecha_ini: fecha,
                fecha_fin: this.fecha_fin,
                nCandidatos: this.nCandidatos
            }
            const body = {
                tabla: "convocatoria",
                keys: Object.keys(convocatoria),
                values: Object.values(convocatoria)
            }
            this.axios.post('/guardar', body)
            .then(resp => {
                console.log(resp.data);
                this.$emit('listar');
                this.setModelo("", "", "", "");
                this.$swal.fire({
                    icon: 'success',
                    title: 'Convocatoria guardada',
                    text: 'Se guardó correctamente la convocatoria'
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
        setModelo(tit, des, fin, nCa){
            this.titulo = tit;
            this.descripcion = des;
            this.fecha_fin = fin;
            this.nCandidatos = nCa;
        },
        modificar(data){
            let datos = data;
            datos.titulo = this.titulo;
            datos.descripcion = this.descripcion;
            datos.fecha_ini = datos.fecha_ini.substring(0, 10);
            datos.fecha_fin = this.fecha_fin;
            datos.nCandidatos = Number(this.nCandidatos);
            const body = {
                tabla: 'convocatoria',
                keys: Object.keys(datos),
                values: Object.values(datos)
            }
            this.$emit('overlay');
            this.$swal.fire({
                    icon: 'question',
                    title: '¿Está seguro de modificar la convocatoria?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.axios.put('/actualiza/'+datos.idConvocatoria, body)
                    .then(resp => {
                        console.log(resp);
                        this.setModelo("", "", "", "");
                        this.$swal.fire('MODIFICADO', 'Se modificó la convocatoria', 'success');
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else if (result.isDenied) {
                    this.$swal.fire('CANCELADO', 'No se modificó la convocatoria', 'info');
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