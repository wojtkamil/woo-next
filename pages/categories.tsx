import {GetStaticProps} from 'next';
import React from 'react';

import ParentCategoriesBlock from 'components/category/category-block/ParentCategoriesBlock';
import Layout from 'components/Layout';
import GET_CATEGORIES_QUERY from 'queries/get-categories';
import ProductMapper from 'src/mw/Mapper';
import {ProductCategory} from 'src/mw/metadata/Metadata';
import client from 'components/ApolloClient';

const Categories = ({productCategories}: {productCategories: ProductCategory[]}): JSX.Element => (
  <Layout>
    <div className='categories product-categories-container container mx-auto my-32 px-4 xl:px-0'>
      <h2 className='text-2xl mb-5 uppercase'>Categories</h2>
      <ParentCategoriesBlock productCategories={productCategories} />
    </div>
  </Layout>
);

export default Categories;

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await client.query({
    query: GET_CATEGORIES_QUERY,
  });

  const productCategories = ProductMapper.productCategoriesFromJson(data?.productCategories?.nodes);

  return {
    props: {
      productCategories,
    },
    revalidate: 1,
  };
};
