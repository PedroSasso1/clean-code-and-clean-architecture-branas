<script setup lang="ts">
  import Account from '../domain/Account'
  import RideGatewayHttp from '../infra/gateway/RideGatewayHttp';
  import { inject, ref } from 'vue';
  
  const account = ref(new Account("", "", "", "", false, false));
  const accountId = ref("");
  const error = ref("");
  const rideGateway = inject('rideGateway') as RideGatewayHttp
  
  async function signup() {
    const errors = account.value.validate();
    if(errors.length > 0) {
      error.value = errors.join(', ')
      return
    }
    try {
      const output = await rideGateway.signup(account.value);
      accountId.value = output.accountId
    } catch (e: any) {
      error.value = e.message
    }
  } 
</script>

<template>
  <div>
    <h2 class="signup-title">Signup</h2>
    <input class="signup-name" type="text" v-model="account.name">
    <input class="signup-email" type="text" v-model="account.email">
    <input class="signup-cpf" type="text" v-model="account.cpf">
    <input class="signup-car-plate" type="text" v-model="account.carPlate">
    <input class="signup-is-passenger" type="checkbox" v-model="account.isPassenger">
    <input class="signup-is-driver" type="checkbox" v-model="account.isDriver">
    <button class="signup-submit" @click="signup()">Submit</button>
    <span v-if="accountId"  class="signup-account-id">{{ accountId }}</span>
    <span class="signup-error">{{ error }}</span>
  </div>
</template>

<style scoped>
</style>
