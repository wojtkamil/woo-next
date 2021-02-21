import {isEmpty} from 'lodash';
import {GetStaticPaths, GetStaticProps} from 'next';
import React from 'react';

import Layout from 'components/Layout';
import Product from 'components/Product';
import {useRouter} from 'next/router';
import {PRODUCT_BY_CATEGORY_SLUG, PRODUCT_CATEGORIES_SLUGS} from 'queries/product-by-category';
import ProductMapper from 'src/mw/Mapper';
import {ProductObject} from 'src/mw/metadata/Metadata';
import client from 'components/ApolloClient';

const CategorySingle = (
  {categoryName, products}: { categoryName: any, products: ProductObject[] },
): JSX.Element => {
  console.log(products);
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (<div>Loading...</div>);
  }

  return (
    <Layout>
      <div className='product-categories-container container mx-auto my-32 px-4 xl:px-0'>
        { categoryName ? <h3 className='text-2xl mb-5 uppercase'>{ categoryName }</h3> : '' }
        <div className='product-categories grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
          {products?.length && (
            products.map((product) => <Product key={product.id} product={product} />)
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategorySingle;

export const getStaticProps: GetStaticProps = async (context) => {
  const {params: {slug}} = context;

  const {data} = await client.query(({
    query: PRODUCT_BY_CATEGORY_SLUG,
    variables: {slug},
  }));

  const products = ProductMapper.productsFromJson(data?.productCategory?.products?.nodes);

  return {
    props: {
      categoryName: data?.productCategory?.name ?? '',
      products,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const {data} = await client.query({
    query: PRODUCT_CATEGORIES_SLUGS,
  });

  const pathsData = data?.productCategories?.nodes?.reduce((productArray, productCategory) => {
    if (!isEmpty(productCategory?.slug)) {
      productArray.push({params: {slug: productCategory?.slug}});
    }
    return productArray;
  }, []);

  return {
    paths: pathsData,
    fallback: true,
  };
};
