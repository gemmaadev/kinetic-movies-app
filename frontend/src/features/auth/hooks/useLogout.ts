import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { firebaseAuth } from "@/shared/services/firebase";

export function useLogout() {
  const navigate = useNavigate();

  async function logout() {
    await signOut(firebaseAuth);
    navigate("/login");
  }

  return logout;
}
