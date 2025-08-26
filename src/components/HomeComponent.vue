<template>
  <MDBContainer>
    <div
      class="d-flex justify-content-center align-items-center"
      style="height: 100vh"
    >
      <div class="text-center">
        <h5 class="mb-3">{{ msg }}</h5>
      </div>
    </div>
  </MDBContainer>
</template>

<script setup lang="ts">
import { MDBContainer } from "mdb-vue-ui-kit";

defineProps<{ msg: string }>();
</script>
