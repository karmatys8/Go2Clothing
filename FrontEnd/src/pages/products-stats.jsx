import { Helmet } from 'react-helmet-async';

import { ProductsStatsView } from 'src/sections/products-stats/view';

// ----------------------------------------------------------------------

export default function ProductsStatsPage() {
  return (
    <>
      <Helmet>
        <title> Products Stats | Go2Clothes </title>
      </Helmet>

      <ProductsStatsView />
    </>
  );
}
