import {GetStaticProps} from 'next';
import React from 'react';

import ParentCategoriesBlock from 'components/category/category-block/ParentCategoriesBlock';
import HeroCarousel from 'components/home/hero-carousel';
import Layout from 'components/Layout';
import Product from 'components/Product';
import PRODUCTS_AND_CATEGORIES_QUERY from 'queries/product-and-categories';
import ProductMapper from 'src/mw/Mapper';
import {ProductCategory, ProductObject} from 'src/mw/metadata/Metadata';
import client from 'components/ApolloClient';

const Home = (
  { products, productCategories, heroCarousel }
    : { products: ProductObject[], productCategories: ProductCategory[], heroCarousel: any },
): JSX.Element => {
  console.log(productCategories, products); return (
    <Layout>
      <HeroCarousel heroCarousel={heroCarousel} />
      <div className='product-categories-container container mx-auto my-32 px-4 xl:px-0'>
      <h2 className='main-title text-xl mb-5 uppercase'><span className='main-title-inner'>Categories</span></h2>
        <ParentCategoriesBlock productCategories={productCategories} />
      </div>
    <div className='products container mx-auto my-32 px-4 xl:px-0'>
      <h2 className='products-main-title main-title mb-5 text-xl uppercase'><span className='main-title-inner'>Products</span></h2>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4'>
        {products.length && (
          products.map((product) => <Product key={product.id} product={product} />)
        )}
      </div>
    </div>
    </Layout>
  );
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await client.query({
    query: PRODUCTS_AND_CATEGORIES_QUERY,
  });

  const products = ProductMapper.productsFromJson(data?.products?.nodes);
  const productCategories = ProductMapper.productCategoriesFromJson(data?.productCategories?.nodes);

  return {
    props: {
      productCategories,
      products,
      heroCarousel: data?.heroCarousel?.nodes[0]?.children?.nodes ?? [],
    },
    revalidate: 1,
  };
};
