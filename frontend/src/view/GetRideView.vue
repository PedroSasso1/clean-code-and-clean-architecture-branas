<script setup lang="ts">
  import { inject, ref } from 'vue'
  import RideGatewayHttp from '../infra/gateway/RideGatewayHttp'
  
  const ride = ref({}) as any
  const rideId = ref("");
  const error = ref("");
  const rideGateway = inject('rideGateway') as RideGatewayHttp

  async function submit() {
    try {
      const output = await rideGateway.getRide(rideId.value);
      ride.value = output
    } catch (e: any) {
      error.value = e.message
    }
  }
</script>

<template>
  <h2 class="get-ride-title">Get Ride</h2>
  <input class="get-ride-ride-id" type="text" v-model="rideId">
  <button class="get-ride-submit" @click="submit()">Submit</button>
  <div v-if="ride.status">
    <span class="get-ride-passenger-id">{{ ride.passenger.passengerId }}</span>
    <span class="get-ride-passenger-email">{{ ride.passenger.email }}</span>
    <span class="get-ride-passenger-name">{{ ride.passenger.name }}</span>
    <span class="get-ride-passenger-cpf">{{ ride.passenger.cpf }}</span>
    <span class="get-ride-status">{{ ride.status }}</span>
  </div>
</template>

<style scoped>
</style>