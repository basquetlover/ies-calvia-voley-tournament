import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function EquipoBoxIzq({ children }: Props) {
  return (
    <div className="w-[185px] pr-2 h-[60px] bg-azul rounded-lg grid grid-cols-[45px_1fr_max-content] place-items-center">
      {children}
    </div>
  );
}
