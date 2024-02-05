import { Helmet } from 'react-helmet-async';

import { ProductsStatsView } from 'src/sections/products-stats/view';

// ----------------------------------------------------------------------

export default function ProductsStatsPage() {
  return (
    <>
      <Helmet>
        <title> Products Stats | Minimal UI </title>
      </Helmet>

      <ProductsStatsView />
    </>
  );
}
