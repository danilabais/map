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
        @cell-clicked="onCellClickedRoutes"
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :columnDefs="columnDefsRoutes"
        :rowData="routes"
        v-show="tableState === $options.TABLE_STATES.ROUTES"
      >
      </ag-grid-vue>
      <ag-grid-vue
        @cell-clicked="onCellClickedStops"
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :columnDefs="columnDefsStops"
        :rowData="stops"
        v-show="tableState === $options.TABLE_STATES.STOPS"
      >
      </ag-grid-vue>
    </div>
    <div class="map">
      <l-map
        v-if="true"
        ref="map"
        :center="center"
        style="height: 100%; width: 100%"
        @ready="mapReady"
      >
        <l-tile-layer :url="url" />

        <l-poly-line
          v-for="route in routes"
          :key="route.id"
          :lat-lngs="route.points"
        >
          <l-tooltip>{{ route.name }}</l-tooltip>
        </l-poly-line>

        <l-marker
          v-for="stop in stops"
          :key="stop.uniqId"
          @click="flyToStop(stop.coords)"
          :lat-lng="stop.coords"
        >
          <l-tooltip>{{ stop.name }}</l-tooltip>
          <l-icon
            :icon-url="
              stop.forward ? '/marker-forward.svg' : '/marker-not-forward.svg'
            "
            :icon-size="[24, 24]"
          ></l-icon>
        </l-marker>
      </l-map>
      <pre v-else>{{ JSON.stringify(routes, 0, 2) }}</pre>
    </div>
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
      // icon: icon({
      //   iconUrl: require("@/assets/icons/marker-forward.svg"),
      //   iconSize: [32, 37],
      //   iconAnchor: [16, 37],
      // }),

      zoom: 11,
      center: [47.31322, -1.319482],

      data: null,
      tableState: TABLE_STATES.ROUTES,
      columnDefsRoutes: null,
      columnDefsStops: null,
      rowData: null,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      map: null,
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
    flyToStop(coords, zoom = 15) {
      this.map.flyTo(coords, zoom);
    },
    flyToRoute({ points }) {
      let maxL = 0;
      let minL = Infinity;
      let maxR = 0;
      let minR = Infinity;
      points.forEach(([l, r]) => {
        if (l >= maxL) maxL = l;
        if (l <= minL) minL = l;

        if (r >= maxR) maxR = r;
        if (r <= minR) minR = r;
      });

      const convertToNormal = (val) => {
        if (val > 1) return 4;
        else if (val > 0.2) return 9;
        else if (val > 0.18) return 10;
        else if (val > 0.15) return 11;
        else if (val > 0.01) return 12;
        else return 13;
      };
      const delta = convertToNormal(Math.max(maxL - minL, maxR - minR));

      this.map.flyTo([(maxL + minL) / 2, (maxR + minR) / 2], delta);
    },
    mapReady(e) {
      this.map = e;
    },
    onCellClickedRoutes({ data }) {
      if (!data.points) {
        alert("Точки не найдены, см консоль");
        console.error(
          new Error(
            JSON.stringify(data) +
              " не имеет точек, чтобы сфокусироваться на них!"
          )
        );
        return;
      }
      this.flyToRoute(data);
    },
    onCellClickedStops({ data }) {
      if (!data.coords) {
        alert("Остановки не найдены, см консоль");
        console.error(
          new Error(
            JSON.stringify(data) +
              " не имеет точек, чтобы сфокусироваться на них!"
          )
        );
        return;
      }
      this.flyToStop(data.coords);
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
  overflow: auto;
}
</style>
