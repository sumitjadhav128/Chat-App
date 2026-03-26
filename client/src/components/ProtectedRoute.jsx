import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}){

const { currentUser } = useContext(AuthContext);

if(!currentUser){
return <Navigate to="/login" />;
}

return children;

}