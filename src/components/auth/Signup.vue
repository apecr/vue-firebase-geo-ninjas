<template>
  <div class="signup container">
    <form @submit.prevent="signup" class="card-panel">
      <h2 class="center deep-purple-text">Signup</h2>
      <div class="field">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model="email">
      </div>
      <div class="field">
        <label for="password">Password:</label>
        <input type="password" name="password" v-model="password">
      </div>
      <div class="field">
        <label for="alias">alias:</label>
        <input type="text" name="alias" v-model="alias">
      </div>
      <p class="red-text center" v-if="feedback">{{ feedback }}</p>
      <div class="field center">
        <button class="btn deep-purple">Signup</button>
      </div>
    </form>
  </div>
</template>

<script>
import slugify from "slugify";
import { db } from "@/firebase/init";
import firebase from "firebase";
import functions from "firebase/functions";

export default {
  name: "Signup",
  data() {
    return {
      email: null,
      password: null,
      alias: null,
      slug: null,
      feedback: null
    };
  },
  methods: {
    signup() {
      if (!this.alias || !this.email || !this.password) {
        return (this.feedback = "You must enter all fields");
      }
      this.feedback = null;
      this.slug = slugify(this.alias, {
        replacement: "-",
        remove: /[$*_+~.()'"!\-:@¿?]/g,
        lower: true
      });
      const checkAlias = firebase.functions().httpsCallable("checkAlias");
      checkAlias({ slug: this.slug }).then(result => {
        if (!result.data.uniq) {
          return (this.feedback = "This alias already exists");
        }
        this.feedback = "This is alias is free to use";
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(credential => {
            const user = credential.user;
            console.log(user);
            db.collection("users")
              .doc(this.slug)
              .set({
                alias: this.alias,
                geolocation: null,
                user_id: user.uid
              })
              .then(_ => {
                this.$router.push({ name: "GMap" });
              });
          })
          .catch(error => {
            console.error(error);
            this.feedback = error.message;
          });
      });
    }
  }
};
</script>

<style>
.signup {
  max-width: 400px;
  margin-top: 60px;
}
.signup h2 {
  font-size: 2.4em;
}
.signup .field {
  margin-bottom: 16px;
}
</style>

