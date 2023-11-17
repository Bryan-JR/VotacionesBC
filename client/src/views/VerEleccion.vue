<template>
    <div class="about">
        <h2 class="title">{{ eleccion.titulo }}</h2>
        <v-parallax class="panel" src="../../public/img/fondo.png">
            <v-row>
                <v-col class="w-75 d-flex justify-center" >
                    <v-card class="w-50" title="Información de la elección" :subtitle="'Desde '+formatFecha(eleccion.fecha_ini)+' hasta '+formatFecha(eleccion.fecha_fin)" >
                        <v-card-title>
                            <v-btn @click="connectWallet" v-if="!conectado">Conectar a Metamask</v-btn>
                            <v-chip color="error" v-if="!conectado">Desconectado</v-chip>
                            <v-chip color="primary" v-if="conectado">Conectado: {{ shortAddress }}</v-chip>
                        </v-card-title>
                        <v-card-text>
                           <strong> {{ eleccion.descripcion }} </strong>
                        </v-card-text>
                        <v-card-text><v-chip v-if="conectado">Total votos actuales: {{ totalVotos }}</v-chip></v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-if="wallCheck">
                <cardVotar v-for="(candidato, i) in candidatos" :key="i" @cargar="cargarEleccion" :candidato="candidato" :voted="voted" :datos="candidatosBC[i]"/>
            </v-row>
        </v-parallax>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import cardVotar from '../components/cardVotar.vue';

export default {
    components: { cardVotar },
    data() {
        return {
            conectado: false,
            wallCheck: false,
            usuario: {},
            shortAddress: '',
            wallets: [],
            eleccion: {},
            candidatos: [],
            candidatosBC: [],
            voted: false,
            idEle: this.$route.params.id,
        }
    },
    methods: {
        async cargarEleccion(){
            await this.axios.get('/eleccion/'+this.idEle)
            .then(resp => {
                this.eleccion = resp.data[0];
                
            })
            .catch(err => {
                console.log(err);
            });
            await this.getCandidatos();
            this.cargarInfo();
        },
        formatFecha(fecha) {
            const dateObj = new Date(fecha);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            
            return `${day}/${month}/${year}`;
        },
        cargarInfo(){
            this.axios.get('/candidatos/elecciones/'+this.idEle)
            .then(resp => {
                this.candidatos = resp.data[0];
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
            await this.$swal.fire({
            title: "Conectando cuenta...",
            timerProgressBar: true,
            didOpen: async () => {
                this.$swal.showLoading()
                this.wallets = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                this.conectado = true;
                const firstPart = this.wallets[0].substring(0,6);
                const secondPart = this.wallets[0].substring(38, 42);
                this.shortAddress = `${firstPart}...${secondPart}`;
                this.$swal.update({title: "Cuenta conectada", text: "Su cuenta de MetaMask conectada.", icon: "success", showConfirmButton: true});
                this.$swal.hideLoading();
            }
            });
        },
        async getContract() {
            try {
                const provider = await new ethers.BrowserProvider(window.ethereum);
                const contractAddress = '0x70BF1E63663d89B86Ad844115DC6B30B45622782';
                const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_idProposal","type":"uint256"},{"internalType":"uint256","name":"_idElection","type":"uint256"}],"name":"addProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChairPerson","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLengthProposals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProposals","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"internalType":"struct Vote.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idElection","type":"uint256"}],"name":"getProposalsByIdElection","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"internalType":"struct Vote.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getVotesById","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"idCandidato","type":"uint32"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"uint256","name":"vote","type":"uint256"}],"stateMutability":"view","type":"function"}];
                const contract = new ethers.Contract(contractAddress, contractABI, provider);
                return contract;
            } catch (error) {
                console.log(error);
                console.log("connected contract not found");
                return null;
            }
        },
        async getCandidatos(){
            try {
                const conect = await this.getContract();
                const registro = await conect.getProposalsByIdElection(this.idEle);
                this.candidatosBC = registro.map(obj => ({nombre: obj[0], idCandidato: Number(obj[1]), idEleccion: Number(obj[2]), votos: Number(obj[3])}));
                await this.verificarVoto();
            } catch (error) {
                console.error(error);
            }
        },
        async verificarVoto(){
            try {
                const conect = await this.getContract();
                this.voted = await conect.voters(this.wallets[0]);
                console.log(this.voted[0]);
            } catch (error) {
                console.error(error);
            }
        },
        async registraBilletera(){
            this.usuario = JSON.parse(localStorage.getItem("usuario"));
            console.log(this.usuario);
            console.log(this.wallets[0]);
            if(this.usuario.billetera===""||this.usuario.billetera==null){
                const obj = {
                    identificacion: this.usuario.identificacion,
                    billetera: this.wallets[0]
                }
                const body = {
                    tabla: 'usuario',
                    keys: Object.keys(obj),
                    values: Object.values(obj)
                }
                await this.axios.put('/actualiza/'+obj.identificacion, body)
                .then(res => {
                    console.log(res);
                    this.wallCheck = true;
                    this.usuario.billetera = this.wallets[0];
                    localStorage.setItem("usuario", JSON.stringify(this.usuario));
                })
                .catch(err => {
                    console.log(err);
                });
            } else if(this.usuario.billetera!==this.wallets[0]){
                this.wallCheck = false;
                this.$swal.fire({
                    icon: 'error',
                    title: 'Tu billetera no coincide',
                    text: 'La billetera con la que intentas votar no se encuentra enlazada con tu cuenta.'
                })
            } else {
                this.wallCheck = true;
            }
        }
    },
    computed:{
        totalVotos(){
            const votos = this.candidatosBC.map(obj => (obj.votos));
            let result = votos.reduce((acumulador, elemento) => acumulador + elemento, 0);
            return result;
        }
    },
    async mounted(){
        await this.connectWallet();
        await this.registraBilletera();
        if(this.wallCheck){
            await this.cargarEleccion();
            await this.$swal.fire({
            title: "Cargando...",
            timer: 1500,
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