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
        :allowContextMenuWithControlKey="true"
        :getContextMenuItems="getContextMenuItems"
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
        ref="map"
        :zoom="$options.LEAFLET_CONFIG.ZOOM"
        :center="$options.LEAFLET_CONFIG.CENTER"
        style="height: 100%; width: 100%"
        @ready="mapReady"
      >
        <l-control position="bottomleft">
          <button
            @click="globalFilter = item"
            v-for="item in $options.TABLE_STATES"
            :class="{ active: item === globalFilter }"
            class="change-state"
          >
            display only {{ item }}
          </button>
          <button
            @click="
              globalFilter = null;
              filterStops = null;
              filterRoutes = null;
            "
          >
            reset all filters
          </button>
        </l-control>
        <l-control position="topright">
          <button @click="addStop">Добавить остановку</button>
        </l-control>
        <l-tile-layer :url="$options.LEAFLET_CONFIG.URL" />
        <template
          v-if="globalFilter === $options.TABLE_STATES.ROUTES || !globalFilter"
        >
          <l-poly-line
            v-for="route in filteredRoutes"
            :key="route.id"
            :lat-lngs="route.points"
            @click="
              flyToRoute(route);
              filterRoutes = route.id;
            "
          >
            <l-tooltip>{{ route.name }}</l-tooltip>
          </l-poly-line>
        </template>

        <template
          v-if="globalFilter === $options.TABLE_STATES.STOPS || !globalFilter"
        >
          <l-marker
            v-for="(stop, idx) in filteredStops"
            :key="stop.uniqId + idx"
            @click="
              flyToStop(stop.coords);
              filterStops = stop.uniqId;
            "
            :lat-lng="stop.coords"
          >
            <l-tooltip>{{ stop.name }}</l-tooltip>
            <l-icon
              :icon-url="
                stop.forward
                  ? require('@/assets/icons/marker-forward.svg')
                  : require('@/assets/icons/marker-not-forward.svg')
              "
              :icon-size="[24, 24]"
            ></l-icon>
          </l-marker>
        </template>
      </l-map>
    </div>
    <AddModal ref="modalAddREF" />
  </div>
</template>

<script>
// @ is an alias to /src
import MainLoader from "@/components/ui/loaders/MainLoader";
import AddModal from "@/components/main/AddModal.vue";

import { mapGetters, mapActions } from "vuex";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue";

const TABLE_STATES = {
  // это типо enum из ts
  ROUTES: "ROUTES",
  STOPS: "STOPS",
};

const LEAFLET_CONFIG = {
  CENTER: [47.31322, -1.319482],
  ZOOM: 3,
  URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

export default {
  name: "MainView",
  components: {
    AgGridVue,
    MainLoader,
    AddModal,
  },
  TABLE_STATES,
  LEAFLET_CONFIG,
  data() {
    return {
      globalFilter: null,
      filterStops: null,
      filterRoutes: null,

      data: null,
      tableState: TABLE_STATES.ROUTES,
      columnDefsRoutes: null,
      columnDefsStops: null,
      rowData: null,
      map: null,
    };
  },

  beforeMount() {
    this.columnDefsRoutes = [
      { field: "name", headerName: "Название" },
      { field: "countRoutes", headerName: "Количество остановок" },
    ];
    this.columnDefsStops = [
      { field: "name", headerName: "Название" },
      {
        field: "forward",
        headerName: "Направление",
        valueFormatter: this.foramatForward,
      },
      { field: "countStopes", headerName: "Количество дорог" },
    ];
  },

  methods: {
    ...mapActions(["addStopToState"]),
    async addStop() {
      const response = await this.$refs.modalAddREF.openModal();
      if (!response) return;
      this.addStopToState(response);
    },
    flyToStop(coords, zoom = 15) {
      this.map.flyTo(coords, zoom);
    },
    foramatForward({ value }) {
      return (value ? "Прямое " : "Обратное ") + "направление";
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
      this.filterStops = null;
      if (!data.points) {
        alert("Точки не найдены, см консоль");
        console.error(
          new Error(data, " не имеет точек, чтобы сфокусироваться на них!")
        );
        return;
      }
      this.flyToRoute(data);
      this.filterRoutes = data.id;
    },

    onCellClickedStops({ data }) {
      if (!data.coords) {
        alert("Остановки не найдены, см консоль");
        console.error(
          new Error(data, " не имеет точек, чтобы сфокусироваться на них!")
        );
        return;
      }
      this.flyToStop(data.coords);
      this.filterStops = data.uniqId;
    },
    getContextMenuItems({ node }) {
      return [
        {
          name: "Открыть маршрут " + node.data.name,
          action: () => {
            this.$router.push("/route/" + node.data.id);
          },
        },
      ];
    },
  },
  computed: {
    ...mapGetters([
      "routes",
      "stops",
      // ...
    ]),
    filteredStops() {
      if (this.filterStops) {
        return this.stops.filter((el) => el.uniqId === this.filterStops);
      } else return this.stops;
    },
    filteredRoutes() {
      if (this.filterRoutes) {
        return this.routes.filter((el) => el.id === this.filterRoutes);
      } else return this.routes;
    },
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
.change-state {
  &.active {
    background: rgb(107, 107, 107);
    color: #fff;
  }
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
