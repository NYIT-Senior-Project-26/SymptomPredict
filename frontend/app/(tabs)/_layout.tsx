import { Tabs } from 'expo-router';

import { HeaderBack } from '@/components/HeaderBack';
import { HeaderBrand } from '@/components/HeaderBrand';
import { Icon, IconName } from '@/components/Icon';
import { NavBottom } from '@/components/NavBottom';

// Matches the "Nav/Bottom" component in Figma.
const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'home', title: 'Home', icon: 'home' },
  { name: 'history', title: 'History', icon: 'clock' },
  { name: 'chat', title: 'Chat', icon: 'message' },
  { name: 'profile', title: 'Profile', icon: 'user' },
];

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <NavBottom {...props} />}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            // 2.1 Home shows only the bell; its logo sits in the page body.
            header: ({ options }) =>
              tab.name === 'home' ? <HeaderBrand showLogo={false} /> : <HeaderBack title={options.title ?? ''} />,
            tabBarIcon: ({ color, size }) => <Icon name={tab.icon} size={size} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
