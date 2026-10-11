import { RoleProvider } from '@/context/RoleContext';
import { RoofingAppShell } from '@/components/RoofingAppShell';

export default function Home() {
  return (
    <RoleProvider>
      <RoofingAppShell />
    </RoleProvider>
  );
}
