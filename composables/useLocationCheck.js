import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export function useLocationCheck() {
  const router = useRouter()

  const location = reactive({
    latLon: null,
    miles: 50, // In Miles.
    isLoading: false,
    error: null
  })

  function handleLocationCheck(redirect = "") {
    location.isLoading = true
    location.error = null
    const locationOptions = {
      timeout: 5000,
      ...(window.msCrypto && {
        enableHighAccuracy: false,
        maximumAge: 50000
      })
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.latLon = calculateBoundingBox(
            position.coords.latitude,
            position.coords.longitude,
            location.miles * 1.609 // Convert miles to KM (Approximate)
          )
          location.isLoading = false
          if (redirect !== "") {
            const lat = `${location.latLon.min_lat.toFixed(4)}..${location.latLon.max_lat.toFixed(4)}`
            const long = `${location.latLon.min_lon.toFixed(4)}..${location.latLon.max_lon.toFixed(4)}`
            // Uncomment the following line if you want to add lat and long to the redirect URL
            // redirect += `&lat=${lat}&long=${long}`
            router.push(redirect)
          }
        },
        (error) => {
          location.error = "Not Available"
          location.isLoading = false
          if (redirect !== "") {
            router.push(redirect)
          }
        },
        locationOptions
      )
    } else {
      location.isLoading = false
      location.error = "Not Available"
      if (redirect !== "") {
        router.push(redirect)
      }
    }
  }

  function calculateBoundingBox(lat, long, distance) {
    if (distance < 0) {
      return 'Illegal arguments'
    }

    // helper functions (degrees<->radians)
    const degToRad = (deg) => deg * (Math.PI / 180)
    const radToDeg = (rad) => (180 * rad) / Math.PI

    // coordinate limits
    const MIN_LAT = degToRad(-90)
    const MAX_LAT = degToRad(90)
    const MIN_LON = degToRad(-180)
    const MAX_LON = degToRad(180)

    // Earth's radius (km)
    const R = 6378.1

    // angular distance in radians on a great circle
    const radDist = distance / R

    // center point coordinates (rad)
    const radLat = degToRad(lat)
    const radLon = degToRad(long)

    // minimum and maximum latitudes for given distance
    let minLat = radLat - radDist
    let maxLat = radLat + radDist

    // minimum and maximum longitudes for given distance
    let minLon, maxLon

    // define deltaLon to help determine min and max longitudes
    const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat))

    if (minLat > MIN_LAT && maxLat < MAX_LAT) {
      minLon = radLon - deltaLon
      maxLon = radLon + deltaLon
      if (minLon < MIN_LON) minLon += 2 * Math.PI
      if (maxLon > MAX_LON) maxLon -= 2 * Math.PI
    } else {
      // a pole is within the given distance
      minLat = Math.max(minLat, MIN_LAT)
      maxLat = Math.min(maxLat, MAX_LAT)
      minLon = MIN_LON
      maxLon = MAX_LON
    }

    return {
      min_lat: radToDeg(minLat),
      max_lat: radToDeg(maxLat),
      min_lon: radToDeg(minLon),
      max_lon: radToDeg(maxLon)
    }
  }

  return {
    location,
    handleLocationCheck
  }
}