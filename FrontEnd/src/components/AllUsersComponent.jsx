import React from "react";
import AllUsers from "../pages/AllUsers";
import { ProtectedRoute } from "./ProtectedRoute";

const AllUsersComponent = () => (
  <ProtectedRoute allowedRoles={["admin"]}>
    <AllUsers />
  </ProtectedRoute>
);

export default AllUsersComponent;
