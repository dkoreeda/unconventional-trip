   // <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyChBPH2-5pX8tWNFRXzM0yhZ2v4vduzlS8&libraries=places"></script>

const fetch = require('node-fetch');

const GoogleMaps = {};

GoogleMaps.findByLocation = (data) => {
    return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${data.lat},${data.lng}&radius=50000&type=${data.type}&keyword=${data.keyword}&key=AIzaSyCmXWIHpnA-fIuLrqfzr9PaeonezFtnmm4`);
}

GoogleMaps.findById = (id) => {
    return fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyCmXWIHpnA-fIuLrqfzr9PaeonezFtnmm4');
}

module.exports = GoogleMaps;

