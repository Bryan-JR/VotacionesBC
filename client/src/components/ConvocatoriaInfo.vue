<template>
    <v-container class="cont">
                <v-card style="width: 35%;">
                    <v-card-title class="title">
                        DESCRIPCIÓN
                    </v-card-title>
                    <v-card-subtitle color="green"> {{ 'Desde '+formatFecha(convocatoria.fecha_ini)+' hasta '+formatFecha(convocatoria.fecha_fin)  }} </v-card-subtitle>
                    <v-card-text> {{ convocatoria.descripcion }} </v-card-text>
                </v-card>
                <v-container class="contenedor elevation-2">
                    <h2 class="title">
                        PUEDES APLICAR A ESTA CONVOCATORIA
                    </h2>
                    Tu información cumple con los requisitos minimos para participar en las Elecciones para representante estudiantil. Solo debes seleccionar el segundo representante de tu postulación, el cual deberá aceptar la invitación y cumplir de igual manera los requisitos minimos.
                    <strong v-if="modo==0">Buscar segundo representante: </strong>
                    <strong v-else-if="modo==1">Respuesta del segundo representante</strong>
                    <v-text-field
                        v-if="modo==0"
                        class="w-100"
                        v-model="busca"
                        prepend-icon="mdi-magnify"
                        label="Buscar"
                        hide-details
                    ></v-text-field>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        :search="busca"
                        items-per-page="2"
                    >
                        <template v-slot:item="{ item }"  >
                           <div class="fila">
                                <div class="w-75">
                                    <v-card
                                        :title="item.columns.estudiante.nombre"
                                        :subtitle="item.columns.estudiante.programa"
                                        class="elevation-0"
                                    >
                                    </v-card>
                                </div>
                                <div class="info">
                                    <v-btn
                                        v-if="modo==0"
                                        color="blue-grey-lighten-4"
                                        @click="enviarNotificacion(item.columns.estudiante.id)"
                                    >
                                        Invitar
                                    </v-btn>
                                    <v-row v-if="modo==1">
                                        <v-col>
                                            <v-chip :color="color(status)" >
                                                {{ status }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                    <v-col v-if="modo==1&&status=='Rechazado'">
                                        <v-btn
                                            color="error"
                                            @click="eliminarInvitacion()"
                                        >
                                            Eliminar
                                        </v-btn>
                                    </v-col>
                                </div>
                            </div>
                        </template>
                    </v-data-table>
                    <strong v-if="status=='Aceptado'">Propuestas: </strong>
                    <p v-if="status=='Aceptado'">Deben ser propuestas reales y que cumplan con las directrices de la Universidad.</p>
                    
                    <v-textarea
                    v-if="status=='Aceptado'"
                    counter
                    class="w-100"
                    label="PROPUESTAS"
                    v-model="propuestas"
                    placeholder="Añade tus propuestas..."
                    ></v-textarea>
                    <p v-if="status=='Aceptado'">NOTA: Si decides participar en esta convocatoria no asegura tu participación, la información será validada y se te notificará en caso de pasar el filtro. De igual manera aceptas el tratamiento de datos.</p>
                    <v-checkbox label="Acepta los terminos y condiciones" v-model="terminos" v-if="status=='Aceptado'"></v-checkbox>
                
                    <v-row>
                        <v-col>
                            <v-btn color="green" @click="$router.push('/convocatorias')">VOLVER</v-btn>
                        </v-col>
                        <v-col v-if="status=='Aceptado'&&terminos">
                            <v-btn color="green" @click="postularse()">PARTICIPAR</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
    </v-container>
</template>
<script>
export default {
    name: "ConvocatoriaInfo.vue",
    props: [ 'convocatoria' ],
    data() {
        return {
            idUser: Number(JSON.parse(localStorage.getItem("log")).id),
            headers: [
                {title: "Estudiantes", key: "estudiante"}, 
                {title: "", key: "nombre"},
            ],
            items: [],
            estudiantes: [],
            busca: '',
            propuestas: '',
            notificaciones: [],
            modo: 0,
            emisor: false,
            status: '',
            terminos: false,
        }
    },
    methods: {
        async cargarNotificaciones(){
            await this.axios.get('/notificacion/emisor/'+this.idUser)
            .then(res => {
                this.notificaciones = res.data;
                if(this.notificaciones.length>0) this.emisor = true;
            })
            .catch(err => {
                console.log(err);
            });
            if(!this.emisor){
                await this.axios.get('/notificacion/receptor/'+this.idUser)
                .then(res => {
                    this.notificaciones = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
            }
        },
        async cargarBuscador(){
            await this.cargarNotificaciones();
            this.$emit("carga");
            await this.axios.get('/tablas/usuario/estudiante')
            .then(res => {
                this.estudiantes = res.data;
                if(this.notificaciones.length===0){
                    this.modo = 0;
                    this.items = this.estudiantes.map(dato => ( { 
                        estudiante: {
                            id: dato.identificacion,
                            nombre: dato.nombre+" "+dato.apellido1+" "+dato.apellido2, 
                            programa: dato.programa+', Sem '+dato.sem,
                        },
                        nombre: dato.nombre+" "+dato.apellido1+" "+dato.apellido2,
                        
                    }));
                } else if (this.notificaciones[0].idConvocatoria == this.convocatoria.idConvocatoria) {
                    this.modo = 1;
                    this. status = this.notificaciones[0].estado;
                    if(this.emisor){
                        const i = this.estudiantes.map(dato => dato.identificacion).indexOf(this.notificaciones[0].idReceptor);
                        const segundo = this.estudiantes[i];
                        this.items = [{ 
                            estudiante: {
                                id: segundo.identificacion,
                                nombre: segundo.nombre+" "+segundo.apellido1+" "+segundo.apellido2, 
                                programa: segundo.programa+', Sem '+segundo.sem,
                            },
                            nombre: segundo.nombre+" "+segundo.apellido1+" "+segundo.apellido2,
                            
                        }];
                    } else {
                        const i = this.estudiantes.map(dato => dato.identificacion).indexOf(this.notificaciones[0].idEmisor);
                        const segundo = this.estudiantes[i];
                        this.items = [{ 
                            estudiante: {
                                id: segundo.identificacion,
                                nombre: segundo.nombre+" "+segundo.apellido1+" "+segundo.apellido2, 
                                programa: segundo.programa+', Sem '+segundo.sem,
                            },
                            nombre: segundo.nombre+" "+segundo.apellido1+" "+segundo.apellido2,
                            
                        }];
                    }
                } else {
                    this.modo = -1;
                    this.items = [{ 
                        estudiante: {
                            id: 0,
                            nombre: "Ya está participando en otra convocatoria", 
                            programa: "No puede participar en dos convocatorias a la vez.",
                        },
                        
                    }];
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        formatFecha(fecha) {
            const dateObj = new Date(fecha);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            
            return `${day}/${month}/${year}`;
        },
        async enviarNotificacion(idReceptor){
            const notificacion = {
                idEmisor: this.idUser,
                idReceptor: idReceptor,
                idConvocatoria: this.convocatoria.idConvocatoria,
                estado: "Enviado",
                leido: false,
                hora: this.date.hora,
                fecha: this.date.fecha
            }
            const body = {
                tabla: "notificacion",
                keys: Object.keys(notificacion),
                values: Object.values(notificacion)
            }
            this.$swal.fire({
                    icon: 'question',
                    title: '¿Está seguro de invitar a este estudiante?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await this.axios.post('/guardar', body)
                    .then(resp => {
                        console.log(resp.data);
                        this.$swal.fire({
                            icon: 'success',
                            title: 'Invitación enviada',
                            text: 'Se invitó correctamente al estudiante'
                        });
                        this.cargarBuscador();
                    })
                    .catch(err => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'ERROR',
                            text: err.data
                        });
                    });
                } else if (result.isDenied) {
                    this.$swal.fire('CANCELADO', 'No se invitó a esta persona', 'error');
                }
            });
            
        },
        eliminarInvitacion(){
            this.axios.delete('/eliminar/notificacion/'+this.notificaciones[0].idNotificacion)
            .then(resp => {
                console.log(resp);
                this.cargarBuscador();
            }).catch(err => {
                console.error(err);
            })
        },
        color(estado){
            if(estado==="Enviado") return "blue-grey-darken-1";
            else if (estado==="Aceptado"||estado==="Postulado") return "green-accent-3";
            else return "red-accent-4";
        },
        async actualiza(status){
          const obj = {
            idNotificacion: this.notificaciones[0].idNotificacion,
            estado: status
          }
          const body = {
            tabla: 'notificacion',
            keys: Object.keys(obj),
            values: Object.values(obj)
          }
          await this.axios.put('/actualiza/'+obj.idNotificacion, body)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
          this.menu = false
        },
        postularse(){
            const postulacion = {
                idEleccion: 1,
                idConvocatoria: this.convocatoria.idConvocatoria,
                idEstudiante1: this.notificaciones[0].idEmisor,
                idEstudiante2: this.notificaciones[0].idReceptor,
                propuestas: this.propuestas,
                estado_seleccion: "Postulado",
                terminos: this.terminos
            }
            const body = {
                tabla: "candidato",
                keys: Object.keys(postulacion),
                values: Object.values(postulacion)
            }
            this.$swal.fire({
                    icon: 'question',
                    title: '¿Está seguro de postularse a esta convocatoria?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'SI',
                    denyButtonText: `NO`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await this.axios.post('/guardar', body)
                    .then(resp => {
                        console.log(resp.data);
                        this.$swal.fire({
                            icon: 'success',
                            title: '¡POSTULADO CORRECTAMENTE!',
                            text: 'Se registró su postulación correctamente'
                        });
                        this.actualiza("Postulado");
                        this.cargarBuscador();
                    })
                    .catch(err => {
                        this.$swal.fire({
                            icon: 'error',
                            title: 'ERROR',
                            text: err.data
                        });
                    });
                } else if (result.isDenied) {
                    this.$swal.fire('CANCELADO', 'No se invitó a esta persona', 'error');
                }
            });

        }
    },
    computed: {
        date() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            return { 
                hora:`${hours}:${minutes}:${seconds}`,
                fecha: now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate()
            }
        },
    },
    mounted() {
        this.cargarBuscador();
    },
}
</script>


<style scoped>
.cont {
    display:flex;
    flex-wrap: wrap;
    gap:20px;
}

.fila{
    display: flex;

}

.info{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10em;
}
.title{
    text-align: center;
    padding: 12px 0;
    margin: 0 30px;
    border-bottom: 3px solid #02a50d;
  }
  .contenedor{
    width: 63%;
    border-radius: 10px;
    text-align: justify;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 30px;
    align-items: center;
    background-color: #fdfafa;
  }
</style>