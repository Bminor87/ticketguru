import React from "react";
import { useApiService } from "../../service/ApiProvider";

const FrontPage = () => {
  const { fetchAuthUser, user } = useApiService();
  return (
    <div>
      <h1 className="text-3xl">Welcome to TicketGuru, {user?.firstName}</h1>
      <p className="text-gray-500 dark:text-gray-300">
        Your one-stop solution for all your ticketing needs.
      </p>
    </div>
  );
};

export default FrontPage;
