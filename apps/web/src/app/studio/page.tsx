import { redirect } from 'next/navigation';

export default function LegacyStudioPage() {
  redirect('/dashboard/studio');
}
