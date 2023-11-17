<template>
  <v-card class="d-flex flex-column justify-space-around justify-center mx-auto w-75 pa-0 bg-teal-lighten-5 my-8" max-width="380">
    <v-card-item class="pa-0">
      <div class="bg-teal-lighten-4 mx-0 px-0">
        <h3 class="text-center mx-6 font-weight-bold pt-3">#{{ candidato.idCandidato.toString().padStart(3, '0') }}</h3>
        <div class="text-h6 mb-1 mx-3 mt-1 text-primary font-weight-bold">
        </div>
      </div>
    </v-card-item>

    <v-card-text class="d-flex flex-column justify-space-around justify-center " style="gap:10px;" >
      <div class="d-flex flex-row  justify-space-around my-2">
        <div class="d-flex flex-column align-center justify-space-around w-100 my-5">
          <h4 class="font-weight-regular text-center font-weight-bold">Principal</h4>
          <v-avatar icon="mdi-account-circle-outline" size="120" class="mx-2 text-h3"></v-avatar>
          <h4 class="font-weight-regular text-center pa-2">{{ candidato.nombre1 }}</h4>
        </div>

        <v-divider
          class="border-opacity-75"
          color="warning"
          :thickness="2"
          vertical
        ></v-divider>

        <div class="d-flex flex-column align-center justify-space-around w-100 my-5">
          <h4 class="font-weight-regular  text-center font-weight-bold">Suplente</h4>
          <v-avatar icon="mdi-account-circle-outline" size="120" class="mx-2 text-h3"></v-avatar>
          <h4 class="font-weight-regular text-center pa-2">{{ candidato.nombre2 }}</h4>
        </div>
      </div>
      <h2 class="font-weight-regular text-center pa-4" v-if="candidato.nombre1!=='VOTO EN BLANCO'">{{ candidato.programa1 }} - {{ candidato.programa2 }}</h2>
      <v-chip class="mx-auto w-25 text-center" v-if="user.type==='admin'"> Votos: {{ datos.votos }} </v-chip>
    </v-card-text>

    <v-card-actions class="d-flex justify-center">
      <v-btn class="bg-lime-darken-3" v-if="!voted[0]&&user.type!=='admin'" @click="votar(candidato.idCandidato)">Votar</v-btn>
      <v-chip color="primary" v-if="voted[0]&&candidato.idCandidato===votado.id"> Votado </v-chip>
      <br>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ethers } from 'ethers';
export default {
  props: [ 'candidato', 'voted', 'datos' ],
  data(){
    return {
      votado: {id: Number(this.voted[1])},
      user: JSON.parse(localStorage.getItem('log')),
    }
  },
  methods: {
    async getContract() {
        try {
            const provider = await new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractAddress = '0x70BF1E63663d89B86Ad844115DC6B30B45622782';
            const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_idProposal","type":"uint256"},{"internalType":"uint256","name":"_idElection","type":"uint256"}],"name":"addProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChairPerson","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLengthProposals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProposals","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"internalType":"struct Vote.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idElection","type":"uint256"}],"name":"getProposalsByIdElection","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"internalType":"struct Vote.Proposal[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getVotesById","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"idProposal","type":"uint256"},{"internalType":"uint256","name":"idElection","type":"uint256"},{"internalType":"uint256","name":"votesCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"idCandidato","type":"uint32"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"voted","type":"bool"},{"internalType":"uint256","name":"vote","type":"uint256"}],"stateMutability":"view","type":"function"}];
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            return contract;
        } catch (error) {
            console.log(error);
            console.log("connected contract not found");
            return null;
        }
    },
    async votar(idCandidato){
      try {
        await this.$swal.fire({
            title: '¿Está seguro de votar por este candidato?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'SI',
            denyButtonText: `NO`,
        }).then(async (result) => {
        if (result.isConfirmed) {
            await this.$swal.fire({
                title: 'Realizando transacción...',
                timerProgressBar: true,
                showConfirmButton: false,
                didOpen: async () => {
                    this.$swal.showLoading();
                    const conect = await this.getContract();
                    const registro = await conect.vote(idCandidato);
                    const recibe = await registro.wait();
                    console.log(recibe);
                    this.$swal.update({title: "Registro Completo", text: "Se registró correctamente en la blockchain", icon: "success", showConfirmButton: true});
                    this.$emit("cargar");
                    this.$swal.hideLoading();
                }
            });
        } else if (result.isDenied) {
            this.$swal.fire('No votó por este candidato', '', 'info');
        }
        });  
      } catch (error) {
          console.error(error);
      }
    },
    
  },

}
</script>