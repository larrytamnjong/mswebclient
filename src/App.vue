<template>
  <MDBNavbar expand="lg" light bg="light" container>
    <MDBNavbarBrand href="#">DIMA WMS</MDBNavbarBrand>
    <MDBNavbarToggler @click="collapse1 = !collapse1" target="#navbarSupportedContent"></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem to="/">
          Home
        </MDBNavbarItem>
        <MDBNavbarItem to="/products">
          Products
        </MDBNavbarItem>
        <MDBNavbarItem to="/locations">
          Locations
        </MDBNavbarItem>
        <MDBNavbarItem to="/stock-transfers">
          Stock Transfers
        </MDBNavbarItem>
        <MDBNavbarItem to="/inventory-snapshot">
          Inventory Snapshots
        </MDBNavbarItem>
      </MDBNavbarNav>
      <form class="d-flex input-group w-auto">
        <input
          type="search"
          class="form-control"
          placeholder="Type query"
          aria-label="Search"
        />
        <MDBBtn outline="primary">
          Search
        </MDBBtn>
      </form>
    </MDBCollapse>
  </MDBNavbar>
  <router-view />
</template>

<script setup lang="ts">
  import {
    MDBBtn,
    MDBNavbar,
    MDBNavbarToggler,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
  } from 'mdb-vue-ui-kit';
  import { ref } from 'vue';

  const collapse1 = ref(false);
  const dropdown1 = ref(false);
</script>



<style scoped>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
}
</style>
