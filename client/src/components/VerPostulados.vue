<template>
    <v-container>
        <v-card>
            <v-card-title>
                LOS POSTULADOS PARTICIPAN EN:
            </v-card-title>
            <v-card-subtitle>
                <v-btn @click="connectWallet" v-if="!conectado">Conectar a Metamask</v-btn>
                <v-chip color="error" v-if="!conectado">Desconectado</v-chip>
                <v-chip color="primary" v-if="conectado">Conectado: {{ shortAddress }}</v-chip>
            </v-card-subtitle>
            <v-card-text>
                <v-select
                label="CANDIDATOS PARA:"
                :items="titulos"
                item-value="id"
                item-title="label"
                v-model="idEle"
                ></v-select>
            </v-card-text>
        </v-card>
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
                               <v-chip v-if="postu.estado_seleccion!=='Participando'">Postulado</v-chip>
                                <v-chip color="primary" v-if="postu.estado_seleccion==='Participando'">Participando</v-chip>
                                <v-chip color="primary" v-if="postu.estado_seleccion==='Rechazado'">Participando</v-chip>
                            </v-card-text>
                            <v-card-actions v-if="conectado&&postu.estado_seleccion!=='Participando'">
                                <v-btn color="error" @click="actualizaCandidato(postu.idCandidato, 'Rechazado')">RECHAZAR</v-btn>
                                <v-btn color="primary" @click="registrar(`${postu.nombre} ${postu.apellido1} ${postu.apellido2}`, postu.idCandidato)">ACEPTAR</v-btn>
                            </v-card-actions>
                        </v-card>
                </v-row>
            </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
</template>

<script>
import { ethers } from 'ethers';

export default {
    props: [ 'id' ],
    data() {
        return {
            idCon: this.id,
            postulados1: [{nombre: ''}],
            postulados2: [{nombre: ''}],
            mostrar: false,
            conectado: false,
            shortAddress: '',
            wallets: [],
            elecciones: [],
            titulos: [],
            idEle: '',
        }
    },
    methods: {
        async cargarElecciones(){
            await this.axios.get('/eleccion')
            .then(resp => {
                this.elecciones = resp.data;
                this.elecciones.splice(0,1);
                this.titulos = this.elecciones.map(obj => ({id: obj.idEleccion, label:obj.titulo}));
            })
            .catch(err => {
                console.log(err);
            })
        },
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
        },
        async connectWallet() {
            if (!window.ethereum) {
                this.$swal.fire({
                    icon: 'info',
                    title:'Extensión no Instalada',
                    html:'<a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn/related" target="__blank">Descargar aquí</a>'
                });
                this.conectado = false;
                return;
            }
            this.wallets = await window.ethereum.request({
                method: "eth_requestAccounts"
            });
            this.conectado = true;
            const firstPart = this.wallets[0].substring(0,6);
            const secondPart = this.wallets[0].substring(38, 42);
            this.shortAddress = `${firstPart}...${secondPart}`;
        },
        async actualizaCandidato(id, estado){
            await this.cargarCandidatos();
            const obj = {
            idCandidato: id,
            idEleccion: this.idEle,
            estado_seleccion: estado
          }
          const body = {
            tabla: 'candidato',
            keys: Object.keys(obj),
            values: Object.values(obj)
          }
          await this.axios.put('/actualiza/'+obj.idCandidato, body)
          .then(res => {
            console.log(res);
            this.cargarCandidatos();
          })
          .catch(err => {
            console.log(err);
          });
        },
        async getContract() {
            try {
                const provider = await new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contractAddress = '0x9C0a82905c733dFAC6B9eBd4212B8Bd67f23Ca1e';
                const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_idProposal","type":"uint256"},{"internalType":"uint256","name":"_idElection","type":"uint256"}],"name":"addProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChairPerson","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLengthProposals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProposals","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"internalType":"struct Vote.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idElection","type":"uint256"}],"name":"getProposalsByIdElection","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"internalType":"struct Vote.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getVotesById","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"idCandidato","type":"uint32"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"uint256","name":"vote","type":"uint256"}],"stateMutability":"view","type":"function"}];
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                return contract;
            } catch (error) {
                console.log(error);
                console.log("connected contract not found");
                return null;
            }
        },
        async registrar(nombre, id){
            try {
                if(this.idEle!=''){
                    await this.$swal.fire({
                        title: 'Realizando transacción...',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        didOpen: async () => {
                            this.$swal.showLoading();
                            const conect = await this.getContract();
                            const registro = await conect.addProposal(nombre, id, this.idEle);
                            const recibe = await registro.wait();
                            await this.actualizaCandidato(id, "Participando");
                            console.log("Transacción minada en el bloque:", recibe.blockNumber);
                            console.log("Estado de la transacción:", recibe.status);
                            this.$swal.update({title: "Registro Completo", text: "Se registró correctamente en la blockchain", icon: "success", showConfirmButton: true});
                            this.$swal.hideLoading();
                        }
                    });
                    
                } else {
                    this.$swal.fire({title: "ELECCIÓN NO SELECCIONADA", text: "Debe seleccionar una elección", icon: "error"});
                }
            } catch (error) {
                console.error(error);
            }
        }
    },
    async mounted(){
        await this.cargarElecciones();
        await this.cargarCandidatos();
        await this.connectWallet();
        await this.$swal.fire({
        title: "Cargando...",
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