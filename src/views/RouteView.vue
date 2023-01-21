<template>
  <div class="container">
    <header>
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
        <li v-for="item in forwardRoutes" class="stops__text stops__text--blue">
          {{ item.Name || "Без названия" }}
        </li>

        <li
          v-for="item in notForwardRoutes"
          class="stops__text stops__text--red"
        >
          {{ item.Name || "Без названия" }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  created() {
    console.log(this.$route.params.id);
  },
  computed: {
    ...mapGetters(["routes"]),
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
  flex: 1 1;
  overflow: scroll;

  max-height: 100vh;
  margin: 0;
  font-size: 3rem;
  &__text {
    &--blue {
      color: blue;
    }
    &--red {
      color: red;
    }
  }
}
</style>
