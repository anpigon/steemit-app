<template>
  <v-container _fluid fill-height grid-list-md>
     <v-layout>  
      <v-flex xs12 md8 offset-md2 _lg4 _offset-lg4>
        <v-card>
          <v-layout column>
            <v-card-title primary-title>
              <v-flex md8 offset-md2>
                <h1 class="headline">로그인하기</h1>
              </v-flex>
              <v-flex md8 offset-md2>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    prepend-icon="person"
                    v-model="userName"
                    label="User Name"
                    hint="username를 입력하세요."
                    persistent-hint="true"
                    readonly></v-text-field>             
                  <v-text-field
                    prepend-icon="lock"
                    autofocus
                    v-model="password"
                    type="password"
                    label="Password"
                    :rules="passwordRules"
                    required></v-text-field>
                </v-form>
              </v-flex>
            </v-card-title>
            <v-card-actions class='pt-0'>
              <v-flex md8 offset-md2>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="login">로그인</v-btn>
              </v-flex>
            </v-card-actions>
          </v-layout>
        </v-card>
      </v-flex>
     </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      valid: false,
      userName: '',
      password: '',
      passwordRules: [
        // v => !!v || 'Password is required',
        // v => !!auth.validatePassword(v) || 'Password not matched'
      ]
    }
  },
  // created () {},
  deactivated () {
    this.$destroy()
  },
  methods: {
    login () {
      if (this.$refs.form.validate()) {
        // auth.password = this.password
        this.$router.replace(this.$route.query.redirect || '/')
      }
    }
  }
}
</script>