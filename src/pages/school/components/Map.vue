<template>
  <l-map
    style="height: 300px; z-index:80; border: 10px solid white; border-radius: 5px;"
    :zoom="12"
    :center="location"
  >
    <l-tile-layer
      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    ></l-tile-layer>
    <l-marker :lat-lng="location"></l-marker>
  </l-map>
</template>
<script>
let Vue2Leaflet = {}
let Icon
if (process.isClient) {
  Vue2Leaflet = require("vue2-leaflet")
  Icon = require("leaflet").Icon
}

export default {
  components: {
    LMap: Vue2Leaflet.LMap,
    LTileLayer: Vue2Leaflet.LTileLayer,
    LMarker: Vue2Leaflet.LMarker,
  },
  props: {
    location: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  created() {
    if (process.isClient) {
      delete Icon.Default.prototype._getIconUrl
      Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      })
    }
  },
}
</script>
