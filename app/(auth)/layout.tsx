import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout:React.FC<AuthLayoutProps> = ({children}) => {
  return (  
    <div className="flex-center min-h-screen w-full">
      {children}
    </div>
  );
}
 
export default AuthLayout;