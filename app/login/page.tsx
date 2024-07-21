'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Monster } from "@/types/user";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useLocalStorageState('monster-user');
  const form = useForm<Monster>({
    defaultValues: {
      name: '',
      id: '1',
    }
  });
  const maxMonster = 25;

  const onSubmit: SubmitHandler<Monster> = (data) => {
    setUser(data);
    router.push('/');
  };

  const errorSubmit = () => {
    alert('input name');
  }

  return (
    <div className="container py-10 max-w-lg">
      <h1 className="font-bold text-2xl mb-6">login</h1>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit, errorSubmit)}>
        <div>
          <label htmlFor="name">username</label>
          <Input
            id="name"
            {...form.register("name", {
              required: true,
            })}
          />
        </div>
        <div>
          <h2>Avatar</h2>
          <div className='grid grid-cols-4 gap-2'>
            {[...Array(maxMonster)].map((_, i) => (
              <button
                className={cn("p-2 border rounded-lg bg-muted", form.watch('id') === String(i + 1) && 'ring ring-sky-400')}
                type="button"
                onClick={() => form.setValue("id", String(i + 1))}
                key={i}
              >
                <Image
                  src={`/monster-${i + 1}.svg`}
                  alt=""
                  width={80}
                  height={160}
                />
              </button>
            ))}
          </div>
        </div>
        <Button>in the room</Button>

        <pre className="p-2 border rounded-lg bg-muted">
          {JSON.stringify(form.watch(), null, 2)}
        </pre>
      </form>
    </div>
  );
}