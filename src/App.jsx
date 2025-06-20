import Routing from './routes/Routing';
import SessionProvider from './context/SessionProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <SessionProvider>
      <Routing />
    </SessionProvider>
  );
}

export default App;