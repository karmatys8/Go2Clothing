import { Helmet } from 'react-helmet-async';

import { StatsView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AdminStatsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <StatsView />
    </>
  );
}
