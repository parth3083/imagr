import { StudioPage } from '@/features/studio/studio-page';
import { ApiKeyGate } from '@/features/user-settings/components/api-key-gate';

export default function Studio() {
  return (
    <ApiKeyGate>
      <StudioPage />
    </ApiKeyGate>
  );
}
