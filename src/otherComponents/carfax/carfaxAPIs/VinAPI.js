import axios from 'axios';

// API base url
const BASE_URL = 'https://consumerapi.carfax.com/smc/smb/initial-vehicle-info';

// API call to fetch vin data
// export const fetchVehicleFromVin = (vin) =>
//   axios.post(BASE_URL, requestBody('vehicleFromVin', vin));

export const fetchVehicleFromVin = (vin) =>
  axios.post(BASE_URL, { vin, vehicleZip: '95117' });
