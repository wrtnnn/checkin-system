"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
  _id: string;
  name: string;
  role: {
    th: string;
    en: string;
  };
  __v: number;
};

type Checkin = {
  user: string;
  time: string;
}

const UserContext = createContext<User[]>([]);

export function useUsers() {
    return useContext(UserContext);
}

const CheckinContext = createContext<Checkin[]>([]);

export function useCheckins() {
    return useContext(CheckinContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log("Failed to fetch users", error);
      }
    }
    fetchUsers();

    const fetchCheckins = async () => {
      try {
        const res = await fetch("http://localhost:8080/checkins");
        const data = await res.json();
        setCheckins(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCheckins();
  }, []);

  if (loading) return <div>Loading Informations</div>; 

  return (
    <UserContext.Provider value={users}>
        <CheckinContext.Provider value={checkins}>
            {children}
        </CheckinContext.Provider>
    </UserContext.Provider>
  )
}
