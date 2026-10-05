import { useEffect } from 'react';
import env from './config/env';
import ServerStatus from './components/ServerStatus';

export default function App() {
  useEffect(() => {
    document.title = env.appTitle;
  }, []);

  return (
    <main className="page">
      <ServerStatus />
    </main>
  );
}
