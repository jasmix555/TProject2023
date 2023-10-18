import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: countries } = await supabase.from("countries").select();

  const country2 = countries?.find((country) => country.id === 2);

  return (
    <>
      <ul>
        {countries?.map((country) => (
          <li key={country.id}>{country.name}</li>
        ))}
      </ul>
      {country2 && <p>Country 2: {country2.name}</p>}
    </>
  );
}
