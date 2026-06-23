import { useState } from "react";
import { initialFormData } from "./formDefaults";
import { FormContext } from "./formContextValue";

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialFormData);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
