<template>
  <v-app>
    <headerApp @cargar="cargar()" :log="log" :usuario="user"/>
    <v-main>
      <router-view @cargar="cargar()"/>
    </v-main>
    <FooterApp />
  </v-app>
</template>

<script>
import headerApp from '@/components/headerApp.vue';
import FooterApp from '@/components/FooterApp.vue';

export default {
  name: 'App',
  components: { headerApp, FooterApp },
  data: () => ({
    log: {},
    user: {},
  }),
  methods:{
    cargar(){
      this.log = JSON.parse(localStorage.getItem("log"));
      this.user = JSON.parse(localStorage.getItem("usuario"));
    },
  },
  mounted() {
    if(localStorage.getItem("log")===null) localStorage.setItem("log", JSON.stringify({log: false, type: "view"}));
    this.cargar();
  },
}
</script>
