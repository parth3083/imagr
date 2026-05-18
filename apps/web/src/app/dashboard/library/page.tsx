import { StyleLibraryPage } from '@/features/style/library-page';
import { ApiKeyGate } from '@/features/user-settings/components/api-key-gate';

export default function LibraryPage() {
  return (
    <ApiKeyGate>
      <StyleLibraryPage />
    </ApiKeyGate>
  );
}
