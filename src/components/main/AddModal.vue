<template>
  <div class="wrapper" @click.self="closeModal" v-if="isActive">
    <div class="modal">
      <div class="modal__inner">
        <h3 class="modal__title">Добавить остановку</h3>
        <l-map
          :zoom="4"
          :center="stop.position"
          style="height: 200px; width: 100%"
        >
          <l-tile-layer :url="url" />
          <l-marker :draggable="true" :lat-lng.sync="stop.position">
            <l-icon
              :icon-url="
                stop.forward
                  ? require('@/assets/icons/marker-forward.svg')
                  : require('@/assets/icons/marker-not-forward.svg')
              "
              :icon-size="[24, 24]"
            ></l-icon>
            <l-tooltip>{{ stop.name }}</l-tooltip>
          </l-marker>
        </l-map>
        <div class="modal__coords">
          <input
            placeholder="долгота"
            step="0.01"
            class="modal__coords-input"
            type="number"
            v-model="stop.position.lng"
          />
          <input
            placeholder="широта"
            step="0.01"
            class="modal__coords-input"
            type="number"
            v-model="stop.position.lat"
          />
        </div>
        <div class="modal__forward">
          <label class="modal__forward-label" for="checkbox"
            >Прямая остановка?
          </label>
          <input v-model="stop.forward" id="checkbox" type="checkbox" />
        </div>
        <input
          placeholder="Введите название "
          type="text"
          v-model.sync="stop.name"
          class="modal__name"
        />
        <select class="modal__select" v-model="stop.routeId">
          <option selected :value="null">Не выбранно</option>
          <option v-for="item in routes" :value="`${item.id}`">
            {{ item.name }}
          </option>
        </select>
        <div class="modal__error">
          <span v-for="error in errors" class="modal__error-text">{{
            error
          }}</span>
        </div>
        <button @click="saveStop">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
const ERRORS = {
  LAT: "Широта  не валидна!",
  LON: "Долгота не валидна!",
  NAME: "Введите имя остановки!",
  ROUTE: "Выберите дорогу!",
};
let popupController = null;
import { mapGetters } from "vuex";
export default {
  name: "AddModal",
  popupController,
  ERRORS,
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      isActive: false,
      stop: {
        position: { lng: 30.315227508544925, lat: 59.94907936115716 },
        forward: false,
        name: "Название остановки",
        routeId: null,
      },
      errors: {
        lat: null,
        lon: null,
        name: null,
        route: null,
      },
    };
  },
  methods: {
    closeModal() {
      this.isActive = false;
      popupController.resolve(null);
    },
    openModal() {
      let resolve;
      let reject;
      const popupPromise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
      });
      popupController = { resolve, reject };
      this.isActive = true;
      return popupPromise;
    },
    validate() {
      if (this.stop.position.lng < -200 || this.stop.position.lng > 200) {
        this.errors.lon = ERRORS.LON;
      } else this.errors.lon = null;
      if (this.stop.position.lat < -200 || this.stop.position.lat > 200) {
        this.errors.lat = ERRORS.LAT;
      } else this.errors.lat = null;
      if (!this.stop.name) {
        this.errors.name = ERRORS.NAME;
      } else this.errors.name = null;
      if (!this.stop.routeId) {
        this.errors.route = ERRORS.ROUTE;
      } else this.errors.route = null;

      return (
        this.errors.name ||
        this.errors.name ||
        this.errors.name ||
        this.errors.route
      );
    },
    saveStop() {
      if (this.validate()) return;
      this.isActive = false;
      popupController.resolve(this.stop);
    },
  },
  computed: {
    ...mapGetters([
      "routes",
      // ...
    ]),
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.259);
  z-index: 10000;
  backdrop-filter: blur(10px);
}
.modal {
  min-width: 400px;
  min-height: 50%;
  max-height: 100%;
  background: #ddd;
  border-radius: 20px;
  &__inner {
    margin: 10px 20px;
    display: flex;
    flex-direction: column;
  }
  &__title {
    text-align: center;
    font-size: 1.5rem;
  }
  &__coords {
    display: flex;
    justify-content: space-between;
  }
  &__coords-input {
    flex: 0 1 50%;
    margin-bottom: 10px;
  }
  &__forward {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    padding-bottom: 20px;
  }
  &__forward-label {
    margin-right: 5px;
  }
  &__name {
    padding: 5px 10px;
    border-radius: 10px;
    outline: none;
    margin-bottom: 10px;
  }
  &__select {
    padding: 5px 10px;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  &__error {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }
  &__error-text {
    color: red;
  }
}
</style>
