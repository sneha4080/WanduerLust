let MAP_TOKEN = mapToken;
console.log(mapToken)
mapboxgl.accessToken = mapToken
{/* // TO MAKE THE MAP APPEAR YOU MUST / }
{/ // ADD YOUR ACCESS TOKEN FROM / }
{/ // https://account.mapbox.com/ */ }
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', //style URL
    center:listing.geometry.coordinates, //starting position [longti,lat]  ki postion ae map khule
    zoom: 10//starting Zoom
});
console.log(coordinates);//print corrdinates to console

mapboxgl.accessToken=window.mapToken;

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat( listing.geometry.coordinates) //Model_listing.js->Geomatery.Coordinates ave
    .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(
        `<h4>${listing.title}</h4> <p>Exact Location will be provided after booking</p>`))
    .addTo(map);



