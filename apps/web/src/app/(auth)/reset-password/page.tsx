import { Suspense } from 'react';

import ResetPasswordPage from '@/features/auth/reset-password/reset-password-page';

const Page = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
      <Suspense>
        <ResetPasswordPage />
      </Suspense>
    </div>
  );
};

export default Page;
