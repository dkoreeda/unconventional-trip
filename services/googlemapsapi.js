   // <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyChBPH2-5pX8tWNFRXzM0yhZ2v4vduzlS8&libraries=places"></script>

const fetch = require('node-fetch');

const GoogleMaps = {};

GoogleMaps.findByLocation = (data) => {
  console.log("find location",data);
    // return fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${data.search}&location=${data.lat},${data.lng}&radius=5&key=AIzaSyCMgtWWlh_lYIzrBcl5XFelkfo3Sd_jTrY`);
    return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${data.lat},${data.lng}&radius=50000&type=${data.type}&keyword=${data.keyword}&key=AIzaSyCmXWIHpnA-fIuLrqfzr9PaeonezFtnmm4`);
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise
}
// AIzaSyCMgtWWlh_lYIzrBcl5XFelkfo3Sd_jTrY
// AIzaSyAT4G9caMuNs3FQOeeYhaWpZfb7MrHPFGY

GoogleMaps.findById = (id) => {
    return fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyCmXWIHpnA-fIuLrqfzr9PaeonezFtnmm4');
}

module.exports = GoogleMaps;

