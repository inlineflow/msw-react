import { useEffect, useState } from "react";
import type { User } from "../types/user";

type UserProfileProps = {
  id: number;
};

export const UserProfile = ({ id }: UserProfileProps) => {
  const [userId, setUserId] = useState(id);
  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const x = await fetch(`/users/${userId}`);
      const resp = await x.json();

      setUser(resp);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>{user?.id}</p>
      <p>{user?.firstName}</p>
      <p>{user?.lastName}</p>
      <div>
        <button onClick={() => setUserId((id) => id - 1)}>Previous User</button>
        <button onClick={() => setUserId((id) => id + 1)}>Next User</button>
      </div>
    </div>
  );
};
