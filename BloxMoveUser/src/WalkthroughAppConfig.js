import AppStyles from './AppStyles';

const WalkthroughAppConfig = {
  onboardingConfig: {
    walkthroughScreens: [
      {
        icon: require('../assets/image/Art-1.jpg'),
        title: 'Request Ride',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac vestibulum',
      },
      {
        icon: require('../assets/image/Art-2.jpg'),
        title: 'Confirm Your Driver',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac vestibulum',
      },
      {
        icon: require('../assets/image/Art-3.jpg'),
        title: 'Track Your Ride',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac vestibulum',
      },
    ],
  },
  drawerMenu: {
    upperMenu: [
      {
        title: 'Home',
        icon: AppStyles.iconSet.homeIcon,
        navigationPath: 'Home',
      },
      {
        title: 'Wallet',
        icon: AppStyles.iconSet.walletIcon,
        navigationPath: 'Wallet',
      },
      {
        title: 'Ride History',
        icon: AppStyles.iconSet.homeIcon,
        navigationPath: 'MyRides',
      },
      {
        title: 'Support',
        icon: AppStyles.iconSet.settingIcon,
        navigationPath: 'Help',
      },
    ],
  },
  nonDrawerMenu: {
    upperMenu: [
      {
        title: 'Home',
        icon: AppStyles.iconSet.homeIcon,
        navigationPath: 'Home',
      },
      {
        title: 'Wallet',
        icon: AppStyles.iconSet.walletIcon,
        navigationPath: 'Wallet',
      },
      {
        title: 'Ride History',
        icon: AppStyles.iconSet.homeIcon,
        navigationPath: 'MyRides',
      },
      {
        title: 'Support',
        icon: AppStyles.iconSet.settingIcon,
        navigationPath: 'Help',
      },
    ],
  },
};

export default WalkthroughAppConfig;
