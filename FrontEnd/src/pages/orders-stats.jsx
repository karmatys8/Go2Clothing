import { Helmet } from 'react-helmet-async';

import { OrdersStatsView } from 'src/sections/order-stats/view';

// ----------------------------------------------------------------------

export default function OrdersStatsPage() {
  return (
    <>
      <Helmet>
        <title> Orders Stats | Minimal UI </title>
      </Helmet>

      <OrdersStatsView />
    </>
  );
}
