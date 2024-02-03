import { Helmet } from 'react-helmet-async';

import { CartView } from 'src/sections/cart/view';

// ----------------------------------------------------------------------

export default function CartPage() {
  return (
    <>
      <Helmet>
        <title> Cart | Minimal UI </title>
      </Helmet>

      <CartView />
    </>
  );
}
