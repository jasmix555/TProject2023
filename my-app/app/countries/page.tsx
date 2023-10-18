import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useState } from "react";

type Insert = {
  id: string;
  name: string;
};

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: countries } = await supabase.from("countries").select();

  return (
    <ul className="my-auto text-foreground">
      {countries?.map((country) => (
        <li key={country.id}>{country.name}</li>
      ))}
    </ul>
  );
}
