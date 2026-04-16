import Dashboard from "./pages/Dashboard";
import { FormProvider } from "./context/FormContext";

function App() {
  return (
    <FormProvider>
      <Dashboard />
    </FormProvider>
  );
}

export default App;