import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';
// utils
import { HYDRATE } from 'next-redux-wrapper';
// import axios from '../../utils/axios';
import axios from 'axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  product: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getVariantsSuccess: (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET PRODUCT
    getVariantSuccess: (state, action) => {
      console.log('getVariantSuccess 🌜🌜🌜🌜🌜🌜🌜', action);
      state.isLoading = false;
      state.product = action.payload;
    },
    // DELETE PRODUCT
    deleteProduct: (state, action) => {
      state.products = reject(state.products, { id: action.payload });
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(
        cart.map((cartItem) => cartItem.price * cartItem.quantity)
      );
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const product = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        state.checkout.cart = state.checkout.cart.map((_product) => {
          const isExisted = _product.id === product.id;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + 1,
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, product], 'id');
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter(
        (item) => item.id !== action.payload
      );

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total =
        state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
  // });

  // // Reducer

  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     console.log('HYDRATE', state, action.payload);
  //     return {
  //       ...state,
  //       ...action.payload.subject,
  //     };
  //   },
  // },
});

console.log(
  'sdfsadfsdafe slice containing all reducer actions from ___redux/slices/product.js, view at https://bit.ly/next12_20 : ',
  slice
);
console.log(
  'This is the typeof etc. ',
  typeof slice.actions.getVariantsSuccess
);
// Reducer
export default slice;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
} = slice.actions;

// ----------------------------------------------------------------------
//! MOVING GRAPHQL HERE
export function getProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products');
      dispatch(slice.actions.getProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products/product', {
        params: { name },
      });
      dispatch(slice.actions.getProductSuccess(response.data.product));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
//! MOVING GRAPHQL HERE
const ALLCARSQUERY = gql`
  query Variants {
    #    variants(where: { product: { name_contains: "Chrysler" } }) {
    # variants(limit: 1000) {
    variants(limit: 1000) {
      id
      car_carFax_status
      car_currentCarURL
      car_name
      car_make_name
      car_price
      price
      active
      car_year
      year
      vehicle_status
      car_vin
      car_stock
      int_car_views
      int_car_odometer
      int_car_samplePayment
      int_car_samplePaymentDetails_Months
      int_car_samplePaymentDetails_APR
      int_car_samplePaymentDetails_DownPayment
      car_exteriorColor
      car_carFaxUrl
      car_imgSrcUrl_1
      car_imgSrcUrl_2
      car_imgSrcUrl_3
      car_imgSrcUrl_4
      car_imgSrcUrl_5
      car_imgSrcUrl_6
      car_dealership
      car_carFax_details_status
      car_carFax_details_status2
      carfax_previousOwnerCount
      make
      model
      trim
      style
      type
      doors
      fuel_type
      fuel_capacity
      city_mileage
      highway_mileage
      engine
      engine_cylinders
      transmission
      transmission_short
      transmission_type
      transmission_speeds
      drivetrain
      anti_brake_system
      steering_type
      curb_weight
      gross_vehicle_weight_rating
      overall_height
      overall_length
      overall_width
      standard_seating
      invoice_price
      delivery_charges
      manufacturer_suggested_retail_price
      production_seq_number
      front_brake_type
      rear_brake_type
      turning_diameter
      front_suspension
      rear_suspension
      front_spring_type
      rear_spring_type
      front_headroom
      rear_headroom
      front_legroom
      rear_legroom
      standard_towing
      maximum_towing
      manufacture_data_manufacture_mpg_city
      manufacture_data_manufacture_mpg_highway
      manufacture_data_manufacture_annual_fuel_cost
      manufacture_data_sticker_url
    }
  }
`;
const CARSMAKEQUERY = gql`
  query VariantsMake($where: JSON) {
    variants(where: $where) {
      # variants {
      id
      qty
      car_odometer
      car_carFaxUrl
      car_currentCarURL
      car_views
      int_car_views
      int_car_odometer
      int_car_samplePayment
      int_car_samplePaymentDetails_Months
      int_car_samplePaymentDetails_APR
      int_car_samplePaymentDetails_DownPayment
      car_exteriorColor
      car_samplePayment
      car_samplePaymentDetails
      car_samplePaymentDetails_DownPayment
      car_samplePaymentDetails_APR
      car_samplePaymentDetails_Months
      # color
      # size
      style
      price
      car_name
      car_make_name
      car_info
      car_info2
      car_stock
      car_url
      car_vin

      model
      year
      description
      dealership
      vehicle_status
      image_url
      car_imgSrcUrl_1
      car_imgSrcUrl_2
      car_imgSrcUrl_3
      car_imgSrcUrl_4
      car_imgSrcUrl_5
      car_imgSrcUrl_6
      car_dealership
      car_price
      car_year
      car_special
      car_fuel_economy
      car_exterior_color
      car_interior_color
      car_transmission
      car_drivetrain
      # car_engine
      product {
        id
        name
        category {
          id
          name
          description
        }
        promo
        featured
        description
      }
      images {
        id
        name
        url
        width
        height
      }
      image_source_1 {
        id
        url
      }
      image_source_list {
        id
        url
      }
      car_highlighted_features_1_feature
      car_highlighted_features_2_feature
      car_highlighted_features_3_feature
      car_highlighted_features_4_feature
      car_highlighted_features_5_feature
      car_highlighted_features_6_feature
      car_highlighted_features_7_feature
      car_highlighted_features_8_feature
      car_package_options_1_name
      car_package_options_1_price
      car_package_options_1_attribute_1
      car_package_options_1_attribute_2
      car_package_options_1_attribute_3
      car_package_options_1_attribute_10
      car_package_options_1_attribute_11
      car_package_options_1_attribute_12
      car_package_options_2_name
      car_package_options_2_attribute_1
      car_package_options_2_attribute_2
      car_package_options_2_attribute_3
      car_package_options_2_attribute_10
      car_package_options_2_attribute_11
      car_package_options_2_attribute_12
      car_package_options_3_name
      car_package_options_3_attribute_1
      car_package_options_3_attribute_2
      car_package_options_3_attribute_3
      car_package_options_3_attribute_10
      car_package_options_3_attribute_11
      car_package_options_3_attribute_12
      car_package_options_4_name
      car_package_options_4_attribute_1
      car_package_options_4_attribute_2
      car_package_options_4_attribute_3
      car_package_options_4_attribute_10
      car_package_options_4_attribute_11
      car_package_options_4_attribute_12
      car_package_options_5_name
      car_package_options_5_attribute_1
      car_package_options_5_attribute_2
      car_package_options_5_attribute_3
      car_package_options_5_attribute_10
      car_package_options_5_attribute_11
      car_package_options_5_attribute_12
      car_package_options_6_name
      car_package_options_6_attribute_1
      car_package_options_6_attribute_2
      car_package_options_6_attribute_3
      car_package_options_3_price
      car_package_options_4_price
      car_package_options_2_price
      car_package_options_5_price
      car_package_options_6_price
    }
  }
`;

const MYCARQUERY = gql`
  query Variant($id: ID!) {
    variant(id: $id) {
      # variants {
      id
      qty
      car_odometer
      car_carFaxUrl
      car_currentCarURL
      car_views
      int_car_views
      int_car_odometer
      int_car_samplePayment
      int_car_samplePaymentDetails_Months
      int_car_samplePaymentDetails_APR
      int_car_samplePaymentDetails_DownPayment
      car_exteriorColor
      car_samplePayment
      car_samplePaymentDetails
      car_samplePaymentDetails_DownPayment
      car_samplePaymentDetails_APR
      car_samplePaymentDetails_Months

      # color
      # size
      style
      price
      car_name
      car_make_name
      car_info
      car_info2
      car_stock
      car_url
      car_vin
      model
      year
      description
      dealership
      vehicle_status
      image_url
      car_imgSrcUrl_1
      car_imgSrcUrl_2
      car_imgSrcUrl_3
      car_imgSrcUrl_4
      car_imgSrcUrl_5
      car_imgSrcUrl_6
      car_dealership
      car_price
      car_year
      car_special
      car_fuel_economy
      car_exterior_color
      car_interior_color
      car_transmission
      car_drivetrain
      # car_engine
      product {
        id
        name
        category {
          id
          name
          description
        }
        promo
        featured
        description
      }
      images {
        id
        name
        url
        width
        height
      }
      image_source_1 {
        id
        url
      }
      image_source_list {
        id
        url
      }
      car_highlighted_features_1_feature
      car_highlighted_features_2_feature
      car_highlighted_features_3_feature
      car_highlighted_features_4_feature
      car_highlighted_features_5_feature
      car_highlighted_features_6_feature
      car_highlighted_features_7_feature
      car_highlighted_features_8_feature
      car_package_options_1_name
      car_package_options_1_price
      car_package_options_1_attribute_1
      car_package_options_1_attribute_2
      car_package_options_1_attribute_3
      car_package_options_1_attribute_10
      car_package_options_1_attribute_11
      car_package_options_1_attribute_12
      car_package_options_2_name
      car_package_options_2_attribute_1
      car_package_options_2_attribute_2
      car_package_options_2_attribute_3
      car_package_options_2_attribute_10
      car_package_options_2_attribute_11
      car_package_options_2_attribute_12
      car_package_options_3_name
      car_package_options_3_attribute_1
      car_package_options_3_attribute_2
      car_package_options_3_attribute_3
      car_package_options_3_attribute_10
      car_package_options_3_attribute_11
      car_package_options_3_attribute_12
      car_package_options_4_name
      car_package_options_4_attribute_1
      car_package_options_4_attribute_2
      car_package_options_4_attribute_3
      car_package_options_4_attribute_10
      car_package_options_4_attribute_11
      car_package_options_4_attribute_12
      car_package_options_5_name
      car_package_options_5_attribute_1
      car_package_options_5_attribute_2
      car_package_options_5_attribute_3
      car_package_options_5_attribute_10
      car_package_options_5_attribute_11
      car_package_options_5_attribute_12
      car_package_options_6_name
      car_package_options_6_attribute_1
      car_package_options_6_attribute_2
      car_package_options_6_attribute_3
      car_package_options_3_price
      car_package_options_4_price
      car_package_options_2_price
      car_package_options_5_price
      car_package_options_6_price
    }
  }
`;

const client = new ApolloClient({
  // uri: `https://api.shopcarx.com/graphql`,
  uri: `http://localhost:1337/graphql`,
  // uri: `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
  cache: new InMemoryCache(),
});

// ----------------------------------------------------------------------

export async function getVariantsJson() {
  try {
    const response = await client.query({
      query: ALLCARSQUERY,
    });
    return response.data.variants;
  } catch (error) {}
}

export function getVariants() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.get(
      //   '/api/strapi-graphql/query-allProducts/'
      // );
      const response = await client.query({
        query: ALLCARSQUERY,
      });

      dispatch(slice.actions.getVariantsSuccess([...response.data.variants]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getVariant(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        '/api/strapi-graphql/query-singleProduct',
        {
          params: { id },
        }
      );

      dispatch(slice.actions.getVariantSuccess(response.data.variant));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getVariantGraphQl(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await client.query({
        // query: CARQUERY,
        query: MYCARQUERY,
        variables: { id },
      });
      dispatch(slice.actions.getVariantSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getVariantMakeGraphQl(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const where = {
        car_make_name_contains: id,
      };
      // const where = {
      //   product: {
      //     name_contains: id,
      //   },
      // };
      const response = await client.query({
        query: CARSMAKEQUERY,
        variables: { where },
      });

      dispatch(slice.actions.getVariantSuccess(response.data.variants));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
