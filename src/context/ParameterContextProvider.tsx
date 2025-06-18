import { createContext, useContext, useEffect, useState } from "react";
import { Parameters } from "../Types";
import { supabase } from "../supabase-client";

interface ParameterContextProviderType {
  children: React.ReactNode;
}

interface ParameterContextType {
  parameters: Parameters;
  setParameters: (parameters: Parameters) => void;
}

const ParameterContext = createContext<ParameterContextType>({
  parameters: [],
  setParameters: () => {},
});

export const ParameterContextProvider = ({
  children,
}: ParameterContextProviderType) => {
  const [parameters, setParameters] = useState<Parameters>([]);
  const fetchParameters = async () => {
    const { error, data } = await supabase.from("parameters").select("*");
    if (error) {
      console.log(error.message);
    }
    if (data) {
      console.log("parameters", data);
      setParameters(data!);
    }
  };
  useEffect(() => {
    fetchParameters();
  }, []);
  // useEffect(() => {
  //   console.log("parameters", parameters);
  // }, [parameters]);

  return (
    <ParameterContext.Provider value={{ parameters, setParameters }}>
      {children}
    </ParameterContext.Provider>
  );
};

export const useParameterContext = () => useContext(ParameterContext);
