import countries from 'world-countries';

const formatedCountries = countries.map(country => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region
}));

// formatedCountries.unshift({
//   label: "My location",
//   flag: "📍",
//   region: "",
//   value: "ML",
//   latlng: function handleLocationClick() {
//     if(navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           return [position.coords.latitude, position.coords.longitude];
//         },
//         () => {
//           console.error("Unable to retrieve your location!");
//         }
//       )
//     }
//     else {
//       console.error("Geolocation not supported!");
//       return null;
//     }
//   },
// });

export default function useCountries () {
  const getAll = () => formatedCountries;

  const getByValue = value => formatedCountries.find(item => item.value === value);

  return {
    getAll,
    getByValue
  };
}