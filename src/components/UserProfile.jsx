import { useUser, UserButton } from '@clerk/clerk-react';

export default function UserProfile() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="user-profile">
      {user && (
        <div className="profile-info">
          <span>Hello, {user.firstName || 'User'}!</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
}