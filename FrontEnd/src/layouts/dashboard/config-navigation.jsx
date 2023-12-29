import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'products',
    path: '/',
    icon: icon('ic_cart'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'stats',
    path: '/stats',
    icon: icon('ic_analytics'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
