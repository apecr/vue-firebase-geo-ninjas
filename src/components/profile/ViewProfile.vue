<template>
    <div class="view-profile container">
        <div v-if="profile" class="card">
            <h2 class="deep-purple-text center">{{profile.alias}}'s Wall</h2>
            <ul class="comments collection">
                <li v-for="(comment, index) in comments" :key="index">
                    <div class="deep-purple-text">{{comment.from}}</div>
                    <div class="grey-text text-darken-2">{{comment.content}}</div>
                </li>
            </ul>
            <form @submit.prevent="addComment">
                <div class="field">
                    <label for="comment">Add a comment:</label>
                    <input type="text" name="comment" v-model="newComment">
                    <p v-if="feedback" class="red-text center">{{feedback}}</p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { db } from "@/firebase/init";
import firebase from "firebase";

export default {
  name: "ViewProfile",
  data() {
    return {
      profile: null,
      newComment: null,
      feedback: null,
      user: null,
      comments: []
    };
  },
  async created() {
    const ref = db.collection("users");

    // get current user
    const userSnapshot = await ref
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get();
    this.user = userSnapshot.docs[0].data();
    this.user.id = userSnapshot.docs[0].id;

    // profile data
    const user = await ref.doc(this.$route.params.id).get();
    this.profile = user.data();

    // comments
    db.collection("comments")
      .where("to", "==", this.$route.params.id)
      .onSnapshot(snapshot => {
        snapshot
          .docChanges()
          .filter(change => change.type === "added")
          .map(change => {
            this.comments.unshift({
              from: change.doc.data().from,
              content: change.doc.data().content
            });
          });
      });
  },
  methods: {
    async addComment() {
      if (!this.newComment) {
        return (this.feedback = "You must enter a comment to add it");
      }
      this.feedback = null;
      await db.collection("comments").add({
        to: this.$route.params.id,
        from: this.user.alias,
        content: this.newComment,
        time: Date.now()
      });
      this.newComment = null;
    }
  }
};
</script>

<style>
.view-profile .card{
    padding: 20px;
    margin-top: 60px;
}
.view-profile .h2{
    font-size: 2em;
    margin-top: 0;
}
.view-profile li{
    padding: 10px;
    border-bottom: 1px solid #eee;
}
</style>


