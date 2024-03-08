import { Helmet } from 'react-helmet-async';

import { OrdersStatsView } from 'src/sections/order-stats/view';

// ----------------------------------------------------------------------

export default function OrdersStatsPage() {
  return (
    <>
      <Helmet>
        <title> Orders Stats | Go2Clothes </title>
      </Helmet>

      <OrdersStatsView />
    </>
  );
}
