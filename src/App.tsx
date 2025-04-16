
import { AuthProvider } from '@/hooks/useAuth';
import { Routes } from '@/Routes';

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
