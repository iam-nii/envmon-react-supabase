import { createContext, useContext, useEffect, useState } from "react";
import { Rooms } from "../Types";
import { supabase } from "../supabase-client";

interface RoomContextProviderType {
  children: React.ReactNode;
}

interface RoomContextType {
  rooms: Rooms;
  setRooms: (value: Rooms) => void;
}

const RoomContext = createContext<RoomContextType>({
  rooms: [],
  setRooms: () => {},
});

export const RoomContextProvider = ({ children }: RoomContextProviderType) => {
  const fetchRooms = async () => {
    const { error, data } = await supabase.from("rooms").select("*");
    if (error) {
      console.error(error.message);
      return;
    }
    if (data) {
      console.log(data);
      setRooms(data!);
    }
  };
  const [rooms, setRooms] = useState<Rooms>([]);
  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => useContext(RoomContext);
