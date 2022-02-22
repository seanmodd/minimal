import axios from 'axios';

// API base url
const BASE_URL = 'https://consumerapi.carfax.com/smc/smb/initial-vehicle-info';
const VIN_BASE_URL = 'https://consumerapi.carfax.com/smc/smb/vins';

// API call to fetch vin data
// export const fetchVehicleFromVin = (vin) =>
//   axios.post(BASE_URL, requestBody('vehicleFromVin', vin));

export const fetchVinFromLicensePlate = (vehiclePlate, vehicleState) =>
  axios.post(VIN_BASE_URL, { vehiclePlate, vehicleState });
export const fetchVehicleFromVin = (vin) =>
  axios.post(BASE_URL, { vin, vehicleZip: '95117' });
