<template>
  <div class="map">
    <LMap
      ref="map"
      :zoom="12"
      :center="[location.lat, location.lon]"
      :use-global-leaflet="false"
      :options="{ attributionControl: false }"
    >
      <LTileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker :lat-lng="[location.lat, location.lon]" />
      <LControlAttribution prefix="" position="topright" />
    </LMap>
  </div>
</template>

<script setup>
  const props = defineProps({
    location: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.hasOwnProperty('lat') && value.hasOwnProperty('lon')
      }
    }
  })
</script>

<style lang="scss" scoped>
  .map {
    position: relative;
    height: 300px;
    border: 10px solid white;
    border-radius: 5px;
    z-index: 0;
  }
</style>