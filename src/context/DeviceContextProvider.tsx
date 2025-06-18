import { createContext, useContext, useEffect, useState } from "react";
import { Devices } from "../Types";
import { supabase } from "../supabase-client";

interface DeviceContextProviderType {
  children: React.ReactNode;
}

interface DeviceContextType {
  devices: Devices;
  setDevices: (device: Devices) => void;
}

const DeviceContext = createContext<DeviceContextType>({
  devices: [],
  setDevices: () => {},
});

export const DeviceContextProvider = ({
  children,
}: DeviceContextProviderType) => {
  const [devices, setDevices] = useState<Devices>([]);

  const fetchDevices = async () => {
    const { error, data } = await supabase.from("devices").select("*");
    if (error) {
      console.error(error.message);
      return;
    }
    if (data) {
      console.log("Devices", data);
      setDevices(data!);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <DeviceContext.Provider value={{ devices, setDevices }}>
      {children}
    </DeviceContext.Provider>
  );
};
export const useDeviceContext = () => useContext(DeviceContext);
