import { useAuthStore } from "@/store/useAuthStore";
import UserInfoCard from "@/components/account/UserInfoCard";
import AddressManager from "@/components/account/AddressManager";

const AccountPage = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Page Header */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and saved addresses
        </p>
      </div>

      {/* Responsive 2-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6">
            <UserInfoCard user={user} />
          </div>
        </div>

        <div className="lg:col-span-8">
          <AddressManager />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
