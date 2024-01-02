import { Helmet } from 'react-helmet-async';

import { SingleProductView } from 'src/sections/product-page/view';

// ----------------------------------------------------------------------

export default function SingleProductPage() {
  return (
    <>
      <Helmet>
        <title> Product page | Minimal UI </title>
      </Helmet>

      <SingleProductView />
    </>
  );
}
