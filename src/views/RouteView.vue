<template>
  <div class="wrapper-loader" v-if="isLoadingRoutes"><MainLoader /></div>
  <div class="container" v-else>
    <header class="header">
      <button @click="$router.back()">Вернуться назад</button>
    </header>
    <div class="inner">
      <div class="main">
        <h1 class="main__title">Имя маршрута: {{ findedRoute.name }}</h1>
        <h3 class="main__description">
          Описание маршрута: {{ findedRoute.descr }}
        </h3>
        <div class="main__stops">
          <p class="main__stops-forward">
            Количество остановок в прямом направлении:
            {{ forwardRoutes.length }}
          </p>
          <p class="main__stops-notforward">
            Количество остановок в обратном направлении:
            {{ notForwardRoutes.length }}
          </p>
        </div>
      </div>
      <ul class="stops">
        <!-- здесь крайне много методов реализации этого -->
        <li
          v-for="(item, idx) in forwardRoutes"
          class="stops__text stops__text--blue"
        >
          {{ ++idx }}) {{ item.Name || "Без названия" }}
        </li>

        <li
          v-for="(item, idx) in notForwardRoutes"
          class="stops__text stops__text--red"
        >
          {{ ++idx }}) {{ item.Name || "Без названия" }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MainLoader from "@/components/ui/loaders/MainLoader";
import { mapGetters } from "vuex";
export default {
  components: { MainLoader },
  created() {
    console.log(this.$route.params.id);
  },
  computed: {
    ...mapGetters(["routes", "isLoadingRoutes"]),
    findedRoute() {
      return this.routes.find((el) => el.id == Number(this.$route.params.id));
    },
    forwardRoutes() {
      return this.findedRoute.stops.filter((stop) => stop.Forward);
    },
    notForwardRoutes() {
      return this.findedRoute.stops.filter((stop) => !stop.Forward);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-top: 20px;
}
.wrapper-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.container {
  max-width: 1200px;
  padding: 0 20px;
  margin: 0 auto;
}
.inner {
  display: flex;
}
.main {
  flex: 0 0 40%;
  margin-right: 20px;
  color: #ddd;
}
.stops {
  flex: 1 1 auto;
  overflow: scroll;
  max-height: 100vh;
  font-size: 2rem;
  list-style: none;
  padding-bottom: 10px;
  &__text {
    padding-bottom: 20px;
    &:last-child {
      margin-bottom: 100px;
    }
    &--blue {
      color: rgb(64, 64, 192);
    }
    &--red {
      color: rgb(167, 53, 53);
    }
  }
}
</style>
