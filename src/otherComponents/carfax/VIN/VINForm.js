import { useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { Button, TextField, Typography, CardContent } from '@mui/material';
import { fetchVehicleFromVin } from 'src/otherComponents/carfax/carfaxAPIs/VinAPI';
import { ContextCarfax } from 'src/otherComponents/carfax/GlobalContextCarfax';
import styles from '../../../../styles/Home.module.css';

function CarfaxForm() {
  const { chosenVehicle, setChosenVehicle } = useContext(ContextCarfax);
  const router = useRouter();

  // state for model
  const [vinValue, setVinValue] = useState('');
  const [vinData, setVinData] = useState([]);

  // updating field selction
  const handleVinInput = async (e) => {
    e.preventDefault();
    setVinValue(e.target.value);
    fetchVehicleFromVinData(e.target.value);

    //* Ask Jayen: why isn't validation working?
    const isValid = await validationSchema.isValid(e.target.value);
    console.log('This is isValid : ', isValid);
  };
  const handleVin = (e) => {
    e.preventDefault();
    setVinValue(e.target.value);
    setChosenVehicle({
      ...chosenVehicle,
      make: vinData.data.vehiclePriceData.make,
      model: vinData.data.vehiclePriceData.model,
      price: vinData.data.vehiclePriceData.price,
      mileage: vinData.data.vehiclePriceData.odometer,
      year: vinData.data.vehiclePriceData.year,
      vin: e.target.value,
    });
    router.push('/dashboard/carfax-value/vin/');
    console.log('This is chosenVehicle : ', chosenVehicle);
    console.log('This is e.target.value : ', e.target.value);
    console.log('This is vinValue : ', vinValue);
    console.log('This is vinData : ', vinData);
    console.log(
      'This is vinData.data.vehiclePriceData.make : ',
      vinData.data.vehiclePriceData.make
    );
    console.log(
      'This is vinData.data.vehiclePriceData.model : ',
      vinData.data.vehiclePriceData.model
    );
    console.log(
      'This is vinData.data.vehiclePriceData.price : ',
      vinData.data.vehiclePriceData.price
    );
    console.log(
      'This is vinData.data.vehiclePriceData.condition : ',
      vinData.data.vehiclePriceData.condition
    );
    console.log(
      'This is vinData.data.vehiclePriceData.odometer : ',
      vinData.data.vehiclePriceData.odometer
    );
    console.log(
      'This is vinData.data.vehiclePriceData.year : ',
      vinData.data.vehiclePriceData.year
    );
  };

  const fetchVehicleFromVinData = (vin) => {
    fetchVehicleFromVin(vin)
      .then((res) => {
        console.log('This is res : ', res);
        setVinData(res);
      })
      .catch((err) => {
        console.log('This is err : ', err);
      });
  };

  //* Below is Yup and react-hook-form validation
  const validationSchema = Yup.object().shape({
    vin: Yup.string()
      .required('Vin is required')
      .matches('[A-HJ-NPR-Z0-9]{17}', 'Vin is not in correct format'),
  });

  return (
    <>
      <Typography sx={{ mt: '15px' }} variant="h6">
        Enter your vehicle's information to get started!
      </Typography>

      <CardContent className={styles.form}>
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
