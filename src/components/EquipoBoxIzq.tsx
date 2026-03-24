import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function EquipoBoxIzq({ children }: Props) {
  return (
    <div className="w-[185px] px-1 h-[65px] bg-azul rounded-lg grid grid-cols-[auto_1fr_max-content] place-items-center">
      {children}
    </div>
  );
}
