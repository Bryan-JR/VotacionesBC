<template>
  <v-card
    class="mx-auto my-16 pa-4 d-flex flex-column justify-center aling-center"
    width="500"
    height="330"
    title="INICIO DE SESIÓN"
  >
    <v-card-text>
      <v-form ref="form">
      <v-text-field
        v-model="user"
        :rules="userRules"
        type="number"
        class="mt-5"
        clearable
        label="Número de documento"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        :counter="16"
        label="Contraseña"
        type="password"
        class="mt-5"
        clearable
        required
      ></v-text-field>

      <div class="d-flex flex-column">
        <v-btn
          variant="text"
          class="mt-4"
          block
          color="teal-accent-4"
          @click="login()"
        >
          INGRESAR
        </v-btn>  
        
      </div>
    </v-form>
    </v-card-text>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      style="bottom: 15px;"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>

export default {
  name: 'LoginForm',
  data(){
    return {
      user: '',
      password: '',
      snackbar: false,
      text: '...',
      timeout: 2000,
      userRules: [
        v => !!v || 'El número de documento es requerido.',
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida.',
        v => (v && v.length <= 16) || 'La contraseña debe tener máximo 16 caracteres.',
      ],
    }
  },
  methods: {
    async login(){
      await this.axios.post('/login',{id: this.user, pass: this.password})
      .then( res => {
        let msg = res.data;
        if(msg==="admin"){
          this.snackbar = true;
          this.text = 'Admin logeado';
          this.$swal.fire({
            icon: 'success',
            title: 'Inicio como Admin correcto',
            text: 'Puedes votar por un representante'
          });
          localStorage.setItem("log", JSON.stringify({log: true, type: "admin"}));
          this.$router.push("/admin");
        } else if (msg==="inicio") {
          this.snackbar = true;
          this.text = 'Usuario logeado';
          this.$swal.fire({
            icon: 'success',
            title: 'Inicio como usuario correcto',
            text: 'Puedes votar por un representante'
          });
          localStorage.setItem("log", JSON.stringify({log: true, type: "usuario"}));
          this.$router.push("/usuario");
        } else if (msg === "incorrecta") {
          this.snackbar = true;
          this.text = 'Contraseña incorrecta';
          this.$swal.fire({
            icon: 'error',
            title: 'Contraseña incorrecta',
            text: 'Vuelve a ingresar la contraseña'
          })
        } else if(msg==="noExiste"){
          this.snackbar = true;
          this.text = 'Usuario no existe';
          this.$swal.fire({
            icon: 'error',
            title: 'Usuario no aparece en el censo',
            text: 'Si tienes algún problema contacta con un administrador.'
          })
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
}
</script>


<style scoped>
</style>
