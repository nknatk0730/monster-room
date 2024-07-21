'use client';

import { useEffect, useState } from "react";
import { Background } from "./components/Background";
import Image from "next/image";

type Monster = {
  id: string;
  name: string;
};

import { createClient } from '@supabase/supabase-js'
import useLocalStorageState from "use-local-storage-state";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_KEY as string);


export default function Home() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [user] = useLocalStorageState('monster-user');

  useEffect(() => {
    const roomOne = supabase.channel("room_01");

    roomOne
      .on("presence", { event: "sync" }, () => {
        const newState = roomOne.presenceState<Monster>();
        setMonsters(Object.values(newState).flat());
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("join", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("leave", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED' || !user) { return }

        await roomOne.track(user); 
      
      });

      return () => {
        roomOne.unsubscribe();
        roomOne.untrack();
      }

  }, [user]);

  return (
    <main className="min-h-dvh relative">
      <Background />

      {!user && (
        <Button className="absolute top-4 right-4" asChild>
          <Link href='/login'>create Monster</Link>
        </Button>
      )}

      <div className="absolute flex items-end gap-2 bottom-0 inset-x-10 h-40">
        {monsters.map((monster, index) => (
          <div key={index} className="relative bg-green-300">
            <p className="absolute bottom-full bg-black p-2 left-1/2 -translate-x-1/2 whitespace-nowrap mb-1 text-white">john doe</p>
            <Image
              src={`/monster-${monster.id}.svg`}
              alt=""
              width={80}
              height={160}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
