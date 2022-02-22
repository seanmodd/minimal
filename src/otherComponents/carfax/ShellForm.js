import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Button,
  Typography,
  CardHeader,
  CardContent,
  Card,
  Grid,
  Box,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Stack,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  fetchMakes,
  fetchModels,
  fetchYears,
} from 'src/otherComponents/carfax/carfaxAPIs/MakeAPI';
import { ContextCarfax } from 'src/otherComponents/carfax/GlobalContextCarfax';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MHidden } from 'src/otherComponents/components/@material-extend';
import styles from '../../../styles/Home.module.css';
import MakeForm from './Make/MakeForm';
import VINForm from './VIN/VINForm';
import LicensePlateForm from './LicensePlate/LicensePlateForm';
import { Block } from './Block';

function CarfaxForm() {
  //* Below is media query
  const theme = useTheme();
  const MyPhone = useMediaQuery(theme.breakpoints.down('sm'));
  const MyDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const MediaComponent = () => (
    <Container width="100%" display="flex" sx={{ mb: 4 }}>
      <MHidden width="smDown">
        <Container width="100%" display="flex">
          <span>{`MyDesktop: ${MyDesktop}`}</span>
        </Container>
      </MHidden>
      <br />
      <MHidden width="smUp">
        <Container width="100%" display="flex">
          <span>{`MyPhone : ${MyPhone}`}</span>
        </Container>
      </MHidden>
      <br />
    </Container>
  );

  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    // '& > *': { mx: '8px !important' },
  };

  const SIMPLE_TAB = [
    { value: '1', label: 'Make & Model', disabled: false, form: <MakeForm /> },
    {
      value: '2',
      label: 'Vehicle VIN',
      disabled: false,
      form: <VINForm />,
    },
    {
      value: '3',
      label: 'License Plate',
      disabled: true,
      form: <LicensePlateForm />,
    },
  ];
  //* Above is media query

  return (
    <>
      <>
        <MediaComponent />
        {/* <Container sx={{ mt: 4 }}> */}
        <Grid container spacing={1}>
          <Grid item>
            <Card>
              <Container align="center">
                <Box
                  component="img"
                  src="/static/carfax.jpg"
                  sx={{
                    maxWidth: '200px',
                    mt: '40px',
                  }}
                />
              </Container>
              <Container align="center">
                <CardHeader title="Get Your CARFAX Trade-In Value" />
              </Container>
              <Block title="3 Easy Ways" sx={style}>
                <TabContext value={value}>
                  <TabList onChange={handleChange}>
                    {SIMPLE_TAB.map((tab, index) => (
                      <Tab
                        sx={{
                          marginLeft: 0,
                          marginRight: 0,
                          marginBottom: 0,
                        }}
                        key={tab.value}
                        label={tab.label}
                        value={String(index + 1)}
                      />
                    ))}
                  </TabList>
                  <Box
                    sx={{
                      p: 2,
                      mt: 1,

                      width: '100%',
                      borderRadius: 1,
                      bgcolor: 'grey.50012',
                    }}
                  >
                    {SIMPLE_TAB.map((panel, index) => (
                      <TabPanel key={panel.value} value={String(index + 1)}>
                        {panel.form}
                      </TabPanel>
                    ))}
                  </Box>
                </TabContext>

                {/* <MakeForm /> */}
                {/* </Container> */}
              </Block>
            </Card>
          </Grid>
        </Grid>
        {/* </Container> */}
      </>
    </>
  );
}
export default CarfaxForm;
