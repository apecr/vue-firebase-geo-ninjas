<template>
    <div class="map">
      <div class="google-map" id="map">
      </div>
    </div>
</template>

<script>
import firebase from "firebase";
import { db } from "@/firebase/init";

export default {
  name: "GMap",
  data() {
    return {
      lat: 53,
      lng: -2
    };
  },
  methods: {
    async renderMap() {
      const map = new google.maps.Map(document.querySelector("#map"), {
        center: {
          lat: this.lat,
          lng: this.lng
        },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      });
      const usersSnapshot = await db.collection("users").get();
      usersSnapshot.docs.map(doc => {
        const data = doc.data();
        if (data.geolocation) {
          const marker = new google.maps.Marker({
            position: {
              lat: data.geolocation.lat,
              lng: data.geolocation.lng
            },
            map
          });
          marker.addListener("click", _ => {
            this.$router.push({ name: "ViewProfile", params: { id: doc.id } });
          });
        }
      });
    }
  },
  async mounted() {
    // get current user
    const user = firebase.auth().currentUser;
    const getPosition = options => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    };
    // get user geolocation
    if (navigator.geolocation) {
      try {
        const currentPosition = await getPosition({
          maximumAge: 60000,
          timeout: 3000
        });
        this.lat = currentPosition.coords.latitude;
        this.lng = currentPosition.coords.longitude;
        const userSnapshot = await db
          .collection("users")
          .where("user_id", "==", user.uid)
          .get();
        await db
          .collection("users")
          .doc(userSnapshot.docs[0].id)
          .update({
            geolocation: {
              lat: currentPosition.coords.latitude,
              lng: currentPosition.coords.longitude
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
    this.renderMap();
  }
};
</script>

<style>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>


