<template>
  <div v-if="false" class="loader">
    <MainLoader />
  </div>
  <div v-else class="container">
    <div class="sidebar">
      <div class="sidebar__togglebar">
        <button
          class="sidebar__togglebar-btn"
          v-for="item in $options.TABLE_STATES"
          @click="tableState = item"
          :class="{ active: item === tableState }"
        >
          {{ item }}
        </button>
      </div>
      <ag-grid-vue
        @cell-clicked="onCellClicked"
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :columnDefs="columnDefsRoutes"
        :rowData="routes"
        v-show="tableState === $options.TABLE_STATES.ROUTES"
      >
      </ag-grid-vue>
      <ag-grid-vue
        @cell-clicked="onCellClicked"
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :columnDefs="columnDefsStops"
        :rowData="stops"
        v-show="tableState === $options.TABLE_STATES.STOPS"
      >
      </ag-grid-vue>
    </div>
    <pre class="map">{{ JSON.stringify(stops, 0, 2) }}</pre>
  </div>
</template>

<script>
// @ is an alias to /src
import MainLoader from "@/components/loaders/MainLoader.vue";

import { mapActions, mapGetters } from "vuex";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue";

const TABLE_STATES = {
  // это типо enum из ts
  ROUTES: "ROUTES",
  STOPS: "STOPS",
};

export default {
  name: "MainView",
  components: { MainLoader },
  TABLE_STATES,
  data() {
    return {
      data: null,
      tableState: TABLE_STATES.ROUTES,
      columnDefsRoutes: null,
      columnDefsStops: null,
      rowData: null,
    };
  },
  components: {
    AgGridVue,
  },
  beforeMount() {
    this.columnDefsRoutes = [{ field: "name" }, { field: "countRoutes" }];
    this.columnDefsStops = [
      { field: "name" },
      { field: "forward" },
      { field: "countStopes" },
    ];
  },
  async created() {
    this.fetchRoutes();
  },
  methods: {
    onCellClicked(data) {
      console.log(data);
    },
    ...mapActions(["fetchRoutes"]),
  },
  computed: {
    ...mapGetters([
      "routes",
      "stops",
      // ...
    ]),
  },
};
</script>

<style scoped lang="scss">
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.container {
  display: flex;
  height: 100%;
  width: 100%;
}
.sidebar {
  flex: 0 0 33%;
  overflow: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  &__togglebar {
    display: flex;
    justify-content: space-between;
  }
  &__togglebar-btn {
    flex: 1;
    background: #ddd;
    outline: none;
    border: none;
    cursor: pointer;
    &.active {
      background: rgb(169, 169, 169);
    }
  }
}
.map {
  flex: 1 1 auto;
  background: green;
  overflow: auto;
}
</style>
