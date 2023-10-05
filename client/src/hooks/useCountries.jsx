import countries from 'world-countries';

const formatedCountries = countries.map(country => ({
  value: country.cca2,
  country: country.name.common,
  flag: country.flag,
  coordinates: country.latlng,
  region: country.region
}));

export default function useCountries () {
  const getAll = () => formatedCountries;

  const getByValue = value => formatedCountries.find(item => item.value === value);

  return {
    getAll,
    getByValue
  };
}