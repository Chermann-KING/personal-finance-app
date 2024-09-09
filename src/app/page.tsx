"use client";

import InputField from "@/ui/InputField";
import ShowPasswordIcon from "@/assets/images/icon-show-password.svg";

export default function Home() {
  return (
    <main className="flex  justify-start items-start gap-3">
      <div className="min-h-screen flex-grow flex flex-col justify-center items-center p-6 border border-red">
        <InputField
          type="email"
          name={"email"}
          placeholder={"email"}
          prefix="$"
          label="Email"
          icon={<ShowPasswordIcon />}
          helperText="Entrez un email valide"
        />
      </div>
    </main>
  );
}
