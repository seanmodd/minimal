import { useRouter } from 'next/router';
import Link from 'next/link';
import yup from 'yup';
import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Button,
  TextField,
  Typography,
  CardHeader,
  CardContent,
  Card,
  Grid,
  Box,
  Select,
  MenuItem,
} from '@mui/material';
import {
  fetchVehicleFromVin,
  fetchVinFromLicensePlate,
} from 'src/otherComponents/carfax/carfaxAPIs/LicensePlateAPI';
import { ContextCarfax } from 'src/otherComponents/carfax/GlobalContextCarfax';
import styles from '../../../../styles/Home.module.css';

function CarfaxForm() {
  const { chosenVehicle, setChosenVehicle } = useContext(ContextCarfax);

  const router = useRouter();

  // state
  const [licensePlateValue, setLicensePlateValue] = useState('7XTD146');
  const [stateValue, setStateValue] = useState('CA');
  const [vinValue, setVinValue] = useState('');
  const [vinData, setVinData] = useState([]);
  // updating field selction
  const handleLicensePlateInput = (e) => {
    e.preventDefault();
    setLicensePlateValue(e.target.value);
    // fetchVinFromLicensePlateData(e.target.value);
  };
  const handleStateInput = (e) => {
    e.preventDefault();
    setStateValue(e.target.value);
    // fetchVinFromLicensePlateData(e.target.value);
  };
  const handleLicenseStateSubmit = () => {
    fetchVinFromLicensePlate(licensePlateValue, stateValue)
      .then((res) => {
        console.log(
          'This is Object.keys(res.data.vinInfos) : ',
          Object.keys(res.data.vinInfos)[0]
        );
        const vin = Object.keys(res.data.vinInfos)[0];
        setVinData(vin);
        console.log(
          "This is vinData and what's being fed into fetchVehicleFromVinData(vin) : ",
          vin
        );
        fetchVehicleFromVinData(vin);
        // setVinData(res);
        console.log('This is vinData.data : ', vinData.data);
        console.log('This is vehicleData : ', vehicleData);
        // router.push('/dashboard/carfax-value/vin-from-plate/');
        setChosenVehicle({
          ...chosenVehicle,
          make: vinData.data.vehiclePriceData.make,
          model: vinData.data.vehiclePriceData.model,
          price: vinData.data.vehiclePriceData.price,
          mileage: vinData.data.vehiclePriceData.odometer,
          year: vinData.data.vehiclePriceData.year,
          vin,
        });
      })
      .catch((err) => {
        console.log('This is err : ', err);
      });
    // setVinValue(e.target.value);
  };

  //* Below is logic to retrieve VIN from License Plate
  // updating field selction
  const handleVinInput = (e) => {
    e.preventDefault();
    setVinValue(e.target.value);
    fetchVehicleFromVinData(e.target.value);
  };
  const handleVin = (e) => {
    e.preventDefault();
    setVinValue(e.target.value);
    console.log(
      'This is vinData.data.vehiclePriceData.make : ',
      vinData.data.vehiclePriceData.make
    );
    setChosenVehicle({
      ...chosenVehicle,
      make: vinData.data.vehiclePriceData.make,
      model: vinData.data.vehiclePriceData.model,
      price: vinData.data.vehiclePriceData.price,
      mileage: vinData.data.vehiclePriceData.odometer,
      year: vinData.data.vehiclePriceData.year,
      vin: e.target.value,
    });
    // router.push('/dashboard/carfax-value/vin/');
  };

  const fetchVehicleFromVinData = (vin) => {
    fetchVehicleFromVin(vin)
      .then((res) => {
        console.log(
          'This is res.data.vehiclePriceData : ',
          res.data.vehiclePriceData
        );
        const vehicleData = res.data.vehiclePriceData;
        setChosenVehicle({
          ...chosenVehicle,
          make: res.data.vehiclePriceData.make,
          model: res.data.vehiclePriceData.model,
          price: res.data.vehiclePriceData.price,
          mileage: res.data.vehiclePriceData.odometer,
          year: res.data.vehiclePriceData.year,
          vin,
        });
        setVinData(vin);
        console.log('This is chosenVehicle !! : ', chosenVehicle);

        // router.push('/dashboard/carfax-value/vin-from-plate/');
      })
      .catch((err) => {
        console.log('This is err : ', err);
      });
  };

  useEffect(() => {
    // fetchMakesData();
    // fetchVehicleFromVinData(vin);
  }, []);

  return (
    <>
      <Typography sx={{ mt: '15px' }} variant="h6">
        Enter your vehicle's information to get started!
      </Typography>

      <CardContent className={styles.form}>
        <Typography sx={{ mt: '15px' }} variant="h6">
          This is the licensePlateValue: {licensePlateValue}
          This is the stateValue: {stateValue}
        </Typography>
        <span>Enter License Plate Number</span>
        <TextField
          value={licensePlateValue}
          sx={{ maxWidth: '400px' }}
          onChange={handleLicensePlateInput}
        />
        <span>State</span>
        <TextField
          value={stateValue}
          sx={{ maxWidth: '400px' }}
          onChange={handleStateInput}
        />
        <Button
          fullWidth
          size="large"
          type="button"
          disabled={!licensePlateValue || !stateValue}
          variant="contained"
          // onClick={handleSubmitClick}
          onClick={handleLicenseStateSubmit}
          sx={{
            whiteSpace: 'nowrap',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          Get VIN!
        </Button>
        <Typography sx={{ mt: '15px' }} variant="h6">
          This is the vinValue: {vinValue}
          This is the vinData: {vinData}
        </Typography>
        <span>Enter VIN</span>
        <TextField
          value={vinValue}
          sx={{ maxWidth: '400px' }}
          onChange={handleVinInput}
        />

        <Button
          fullWidth
          size="large"
          type="button"
          disabled={!vinValue}
          variant="contained"
          // onClick={handleSubmitClick}
          onClick={handleVin}
          sx={{
            whiteSpace: 'nowrap',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          Get Started
        </Button>
      </CardContent>
    </>
  );
}

export default CarfaxForm;
