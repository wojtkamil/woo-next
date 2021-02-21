import {isEmpty} from 'lodash';
import {GetStaticPaths, GetStaticProps} from 'next';
import React from 'react';

import AddToCartButton from 'components/cart/AddToCartButton';
import Layout from 'components/Layout';
import GalleryCarousel from 'components/single-product/gallery-carousel';
import Price from 'components/single-product/price';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS} from 'queries/product-by-slug';
import ProductMapper from 'src/mw/Mapper';
import {ProductObject} from 'src/mw/metadata/Metadata';
import client from 'components/ApolloClient';

const Product = ({product}: {product: ProductObject}): JSX.Element => {
  console.log(product);
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      { product && (
        <div className='single-product container mx-auto my-32 px-4 xl:px-0'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='product-images'>
              {!isEmpty(product?.galleryImages)
                ? (<GalleryCarousel gallery={product?.galleryImages} />)
                : (
                  <Image
                    src={product.image?.sourceUrl}
                    alt='Product image'
                    width={400}
                    height={400}
                    layout='responsive'
                  />
                )}
            </div>
            <div className='product-info'>
              <h4 className='products-main-title text-2xl uppercase'>{product.name}</h4>
              <div className='product-description mb-5'>
                {product?.description}
              </div>
              <Price salesPrice={product?.price} regularPrice={product?.regularPrice} />
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Product;

export const getStaticProps: GetStaticProps = async (context) => {
  const {params: {slug}} = context;

  const {data} = await client.query({
    query: PRODUCT_BY_SLUG_QUERY,
    variables: {slug},
  });

  const product = ProductMapper.productFromJson(data?.product);

  return {
    props: {
      product,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const {data} = await client.query({
    query: PRODUCT_SLUGS,
  });

  const pathsData = data?.products?.nodes?.reduce((paramsArray, product) => {
    if (!isEmpty(product?.slug)) {
      paramsArray.push({params: {slug: product?.slug}});
    }
    return paramsArray;
  }, []);

  return {
    paths: pathsData,
    fallback: true,
  };
};
