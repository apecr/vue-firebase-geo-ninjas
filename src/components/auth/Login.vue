<template>

<div class="login container">
    <form @submit.prevent="login" class="card-panel">
        <h2 class="center deep-purple-text">Login</h2>
        <div class="field">
            <label for="email">Email:</label>
            <input type="email" name="email" v-model="email">
        </div>
        <div class="field">
            <label for="password">Password:</label>
            <input type="password" name="password" v-model="password">
        </div>
        <p class="red-text center" v-if="feedback">{{ feedback }}</p>
        <div class="field">
            <button class="btn deep-purple">Login</button>
        </div>
    </form>
</div>    

</template>

<script>
import firebase from "firebase";

export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      feedback: null
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        return (this.feedback = "Please fill in both fields");
      }
      this.feedback = null;
      try {
        const userSign = await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        this.$router.push({name: 'GMap'});
      } catch (e) {
          this.feedback = e.message;
      }
    }
  }
};
</script>

<style>
</style>


