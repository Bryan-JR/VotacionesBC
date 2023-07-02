<template>
    <v-container>
        <v-expansion-panels variant="inset" class="my-4" v-if="mostrar">
            <v-expansion-panel
                v-for="(postu, i) in postulados1" :key="i"
            >
            <v-expansion-panel-title> {{ `${postu.nombre} ${postu.apellido1} ${postu.apellido2} - ${postulados2[i].nombre} ${postulados2[i].apellido1} ${postulados2[i].apellido2}` }} </v-expansion-panel-title>
            <v-expansion-panel-text> 
                <v-row>
                    <v-col>
                        <v-card title="ESTUDIANTE 1">
                            <v-card-text>
                                Nombre y Apellidos: {{ postu.nombre }} {{ postu.apellido1+" "+postu.apellido2 }} <br>
                                Identificación: {{ postu.tipo_documento+" "+postu.identificacion }} <br>
                                # Celular: {{ postu.numero_celular }} <br>
                                Código PowerCampus: {{ postu.codigopwc }} <br>
                                Facultad: {{ postu.facultad }} <br>
                                Programa: {{ postu.programa }} <br>
                                Semestre: {{ postu.sem }} <br>
                                Nota PGA: {{ postu.nota_pga }} <br>
                                Creditos Plan Academico: {{ postu.creditos_planAc }} <br>
                                Creditos aprobados: {{ postu.total_creditos_apro }} el {{ ((postu.total_creditos_apro*100)/postu.creditos_planAc).toFixed(2) }}% <br>
                                Creditos Periodo Pasado: {{ postu.creditos_periodo }} <br>
                                Creditos Aprobados Periodo Pasado: {{ postu.creditos_apro_periodo }} el {{ ((postu.creditos_apro_periodo*100)/postu.creditos_periodo).toFixed(2) }}% <br>
                                Sanciones: {{ postu.sanciones }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card title="ESTUDIANTE 2">
                            <v-card-text>
                                Nombre y Apellidos: {{ postulados2[i].nombre }} {{ postulados2[i].apellido1+" "+postulados2[i].apellido2 }} <br>
                                Identificación: {{ postulados2[i].tipo_documento+" "+postulados2[i].identificacion }} <br>
                                # Celular: {{ postulados2[i].numero_celular }} <br>
                                Código PowerCampus: {{ postulados2[i].codigopwc }} <br>
                                Facultad: {{ postulados2[i].facultad }} <br>
                                Programa: {{ postulados2[i].programa }} <br>
                                Semestre: {{ postulados2[i].sem }} <br>
                                Nota PGA: {{ postulados2[i].nota_pga }} <br>
                                Creditos Plan Academico: {{ postulados2[i].creditos_planAc }} <br>
                                Creditos aprobados: {{ postulados2[i].total_creditos_apro }} el {{ ((postulados2[i].total_creditos_apro*100)/postulados2[i].creditos_planAc).toFixed(2) }}% <br>
                                Creditos Periodo Pasado: {{ postulados2[i].creditos_periodo }} <br>
                                Creditos Aprobados Periodo Pasado: {{ postulados2[i].creditos_apro_periodo }}  el {{ ((postulados2[i].creditos_apro_periodo*100)/postulados2[i].creditos_periodo).toFixed(2) }}% <br>
                                Sanciones: {{ postulados2[i].sanciones }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-card title="PROPUESTAS">
                            <v-card-text>
                               {{ postu.propuestas }}
                            </v-card-text>
                        </v-card>
                </v-row>
            </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
export default {
    props: [ 'id' ],
    data() {
        return {
            idCon: this.id,
            postulados1: [{nombre: ''}],
            postulados2: [{nombre: ''}],
            mostrar: false,
        }
    },
    methods: {
        async cargarCandidatos(){
            await this.axios.get(`/get/candidatos/${this.idCon}/1`)
            .then(async resp => {
                this.postulados1 = await resp.data;
            })
            .catch(err => {
                console.error(err);
            });
            await this.axios.get(`/get/candidatos/${this.idCon}/2`)
            .then( async resp => {
                this.postulados2 = await resp.data;

            })
            .catch(err => {
                console.error(err);
            });
        }
    },
    async mounted(){
        await this.cargarCandidatos();
        await this.$swal.fire({
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            this.$swal.showLoading()
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === this.$swal.DismissReason.timer) {
            this.mostrar = true;
        }
        })
        
    }
}
</script>