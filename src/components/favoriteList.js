// import { useFormik } from 'formik';
// import { useEffect, useState } from 'react';
// import { filter, includes, orderBy } from 'lodash';
// // redux
// import { useDispatch, useSelector } from 'react-redux';
// import { Backdrop, Container, Stack } from '@mui/material';
// import { getVariants, filterProducts } from 'src/___redux/slices/product';
// // utils
// import fakeRequest from 'src/otherComponents/utils/fakeRequest';
// // components
// import {
//   ShopTagFiltered,
//   ShopProductSort,
//   ShopProductList,
//   ShopFilterSidebar,
// } from 'src/allTemplateComponents/_dashboard/e-commerce/shop';
// import { wrapperStore } from 'src/___redux/store.js';
// import { USER_DATA, USER_FAVORITE_DATA } from 'src/utils/callbacks';
// import useSettings from 'src/otherComponents/hooks/useSettings';

// //* All data here comes from src/___redux/slices/product.js lines 220+ where the getVariants function is being exported!
// //* This then calls an api with Axios which is referencing to localhost:3222/api/products which itself gets data from the graphql server on https://admin.shopcarx.com/graphql which comes back and retrieves data via a graphql setup
// // ----------------------------------------------------------------------

// function applyFilter(products, sortBy, filters) {
//   // SORT BY
//   if (sortBy === 'featured') {
//     products = orderBy(products, ['sold'], ['desc']);
//   }
//   if (sortBy === 'newest') {
//     products = orderBy(products, ['createdAt'], ['desc']);
//   }
//   if (sortBy === 'priceDesc') {
//     products = orderBy(products, ['price'], ['desc']);
//   }
//   if (sortBy === 'priceAsc') {
//     products = orderBy(products, ['price'], ['asc']);
//   }
//   // FILTER PRODUCTS
//   if (filters.gender.length > 0) {
//     products = filter(products, (_product) =>
//       includes(filters.gender, _product.gender)
//     );
//   }
//   if (filters.category !== 'All') {
//     products = filter(
//       products,
//       (_product) => _product.category === filters.category
//     );
//   }
//   if (filters.colors.length > 0) {
//     products = filter(products, (_product) =>
//       _product.colors.some((color) => filters.colors.includes(color))
//     );
//   }
//   if (filters.priceRange) {
//     products = filter(products, (_product) => {
//       if (filters.priceRange === 'below') {
//         return _product.price < 25000;
//       }
//       if (filters.priceRange === 'between') {
//         return _product.price >= 25000 && _product.price <= 75000;
//       }
//       return _product.price > 75000;
//     });
//   }
//   if (filters.rating) {
//     products = filter(products, (_product) => {
//       const convertRating = (value) => {
//         if (value === 'up4Star') return 4;
//         if (value === 'up3Star') return 3;
//         if (value === 'up2Star') return 2;
//         return 1;
//       };
//       return _product.totalRating > convertRating(filters.rating);
//     });
//   }

//   const newData = products.map((item) => ({ ...item, isFavourite: true }));

//   return newData;
// }

// const FavoriteList = (props) => {
//   const { themeStretch } = useSettings();
//   const dispatch = useDispatch();
//   const [openFilter, setOpenFilter] = useState(false);
//   const [favouriteData, setFavouriteData] = USER_FAVORITE_DATA.useSharedState(
//     []
//   );

//   const [userData, setUserData] = USER_DATA.useSharedState();

//   const state_products = useSelector((state) => state.product);

//   const { products, sortBy, filters } = state_products.products.length
//     ? state_products
//     : props.initialReduxState.product;
//   const filteredProducts = applyFilter(products, sortBy, filters);

//   const formik = useFormik({
//     initialValues: {
//       gender: filters.gender,
//       category: filters.category,
//       colors: filters.colors,
//       priceRange: filters.priceRange,
//       rating: filters.rating,
//     },
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         await fakeRequest(500);
//         setSubmitting(false);
//       } catch (error) {
//         console.error(error);
//         setSubmitting(false);
//       }
//     },
//   });

//   const { values, resetForm, handleSubmit, isSubmitting, initialValues } =
//     formik;

//   const isDefault =
//     !values.priceRange &&
//     !values.rating &&
//     values.gender.length === 0 &&
//     values.colors.length === 0 &&
//     values.category === 'All';

//   useEffect(() => {
//     dispatch(getVariants());
//     // dispatch(getVariants());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(filterProducts(values));
//   }, [dispatch, values]);

//   const getFavouritesData = () => {
//     if (userData) {
//       filteredProducts.forEach((product, fIndex) => {
//         userData.forEach((favorite, vIndex) => {
//           if (product.id === favorite.variant) {
//             product.favoriteId = favorite.id;
//           }
//         });
//       });

//       const myArrayFiltered = filteredProducts.filter((product) =>
//         userData.some((favorite) => favorite.variant === product.id)
//       );
//       setFavouriteData(myArrayFiltered);
//     }
//   };

//   useEffect(() => {
//     getFavouritesData();
//   }, [userData]);

//   const handleOpenFilter = () => {
//     setOpenFilter(true);
//   };

//   const handleCloseFilter = () => {
//     setOpenFilter(false);
//   };

//   const handleResetFilter = () => {
//     handleSubmit();
//     resetForm();
//   };

//   const updateFavoritesData = (variantId, id) => {
//     const favData = [...favouriteData];
//     favData.forEach((fItem, fIndex) => {
//       if (fItem.id === variantId) {
//         fItem.favoriteId = id;
//         fItem.isFavourite = !fItem.isFavourite;
//       }
//       return fItem;
//     });

//     setFavouriteData(favData);
//   };

//   return (
//     <Container maxWidth={themeStretch ? false : 'lg'}>
//       <Stack
//         direction="row"
//         flexWrap="wrap-reverse"
//         alignItems="center"
//         justifyContent="flex-end"
//         sx={{ mb: 5 }}
//       >
//         <ShopTagFiltered
//           filters={filters}
//           formik={formik}
//           isShowReset={openFilter}
//           onResetFilter={handleResetFilter}
//           isDefault={isDefault}
//         />

//         <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
//           <ShopFilterSidebar
//             formik={formik}
//             isOpenFilter={openFilter}
//             onResetFilter={handleResetFilter}
//             onOpenFilter={handleOpenFilter}
//             onCloseFilter={handleCloseFilter}
//           />
//           <ShopProductSort />
//         </Stack>
//       </Stack>
//       <ShopProductList
//         //* below is different from pavan version
//         updateFavoritesData={updateFavoritesData}
//         products={favouriteData}
//         isLoad={!filteredProducts && !initialValues}
//       />
//     </Container>
//   );
// };

// export const getServerSideProps = wrapperStore.getServerSideProps(
//   (store) =>
//     async ({ params }) => {
//       await store.dispatch(getVariants());
//       const redux_store = store.getState();

//       return {
//         props: {
//           initialReduxState: redux_store,
//         },
//       };
//     }
// );

// export default FavoriteList;
// // 
