<template>
  <v-card flat>
    <v-container>
      <v-row align="center" justify="center" ma-3 pa-3>
        <v-col cols="12">
          <v-subheader>
            Participants
          </v-subheader>
          <v-list
            style="max-height: 330px"
            class="overflow-y-auto"
            one-line
          >
            <v-list-item v-for="user in selectedUsers" :key="user.id">
              <v-list-item-action>
                <v-checkbox :input-value="user.selected" @click.stop="modifyParticipants(user)"></v-checkbox>
              </v-list-item-action>

              <v-list-item-avatar>
                <v-img :src="user.get('profile_picture')"/>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  &nbsp; {{ user.get('last_name') }}{{ user.get('first_name') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'


export default {
  model: {
    prop: 'participants',
    event: 'change'
  },
  props: ['participants',],
  data () {
    return {
      users: [],
    }
  },
  methods: {
    modifyParticipants: function (user) {
      if (user.selected) {
        var idx = this.participants.indexOf(user.id)
        if (idx !== -1) this.participants.splice(idx, 1)
      } else {
        this.participants.push(user.id)
      }
    }
  }, 
  mounted () {
    firebase.firestore().collection('User').onSnapshot((snapshot) => {
      this.users = snapshot.docs
    })
  },
  watch: {
    participants: function (val) {
      for (let i = 0; i < this.users.length; ++i) {
        this.users[i].selected = val.includes(this.users[i].id)
      }
    }
  },
  computed: {
    selectedUsers: function () {
      var arr = this.users
      for (let i = 0; i < arr.length; ++i) {
        arr[i].selected = this.participants.includes(this.users[i].id)
      }
      return arr
    }
  }
}
</script>