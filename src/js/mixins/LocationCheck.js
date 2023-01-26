export default {
  data(){
    return {
      location:{
        latLon: null,
        miles: 50, //In Miles.
        isLoading: false,
        error: null
      }
    }
  },
  methods:{
    handleLocationCheck: function(redirect = ""){
      this.location.isLoading = true;
      this.location.error = null;
      var locationOptions = {
        timeout: 5000
      };

      if(window.msCrypto) {
                  locationOptions = {
                      enableHighAccuracy: false,
                        maximumAge: 50000,
                        timeout: 5000
                  }
          }      

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.location.latLon = this.calculateBoundingBox(position.coords.latitude, position.coords.longitude, this.location.miles * 1.609); // Convert miles to KM (Aprroximate)
          this.location.isLoading = false;
          this.location.latLon
          if (redirect !== "") {
            var lat = this.location.latLon.min_lat.toFixed(4) + ".." + this.location.latLon.max_lat.toFixed(4);
            var long = this.location.latLon.min_lon.toFixed(4) + ".." + this.location.latLon.max_lon.toFixed(4);            
            //window.location = redirect + '&lat=' + lat + '&long=' + long;
            //window.location = redirect;
          }
        },(error) => {
          console.log(error);
          this.location.error = "Not Available";
          this.location.isLoading = false;
          if (redirect !== "") {
            //window.location = redirect;
            this.$router.push(redirect)
          }
        }, locationOptions);
        
      } else {
        this.location.isLoading = false;
        this.location.error = "Not Available";
        if (redirect !== "") {
          //window.location = redirect;
          this.$router.push(redirect)
        }
      }
    },
    //Distance: Referenced from: https://stackoverflow.com/a/25025590
    calculateBoundingBox: function(lat,long,distance){
      let MIN_LAT, MAX_LAT, MIN_LON, MAX_LON, R, radDist, degLat, degLon, radLat, radLon, minLat, maxLat, minLon, maxLon, deltaLon;
      
      if (distance < 0) {
        return 'Illegal arguments';
      }

      // helper functions (degrees<–>radians)
      Number.prototype.degToRad = function () {
        return this * (Math.PI / 180);
      };

      Number.prototype.radToDeg = function () {
        return (180 * this) / Math.PI;
      };

      // coordinate limits
      MIN_LAT = (-90).degToRad();
      MAX_LAT = (90).degToRad();
      MIN_LON = (-180).degToRad();
      MAX_LON = (180).degToRad();

      // Earth's radius (km)
      R = 6378.1;

      // angular distance in radians on a great circle
      radDist = distance / R;

      // center point coordinates (deg)
      degLat = lat;
      degLon = long;

      // center point coordinates (rad)
      radLat = degLat.degToRad();
      radLon = degLon.degToRad();

      // minimum and maximum latitudes for given distance
      minLat = radLat - radDist;
      maxLat = radLat + radDist;

      // minimum and maximum longitudes for given distance
      minLon = void 0;
      maxLon = void 0;

      // define deltaLon to help determine min and max longitudes
      deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
      if (minLat > MIN_LAT && maxLat < MAX_LAT) {
        minLon = radLon - deltaLon;
        maxLon = radLon + deltaLon;
        if (minLon < MIN_LON) {
          minLon = minLon + 2 * Math.PI;
        }
        if (maxLon > MAX_LON) {
          maxLon = maxLon - 2 * Math.PI;
        }
      }

      // a pole is within the given distance
      else {
        minLat = Math.max(minLat, MIN_LAT);
        maxLat = Math.min(maxLat, MAX_LAT);
        minLon = MIN_LON;
        maxLon = MAX_LON;
      }

      return{
        min_lat:minLat.radToDeg(),
        max_lat:maxLat.radToDeg(),
        min_lon:minLon.radToDeg(),
        max_lon:maxLon.radToDeg()
      };
    },
  }
}