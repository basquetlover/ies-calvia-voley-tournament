import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function EquipoBoxDer({ children }: Props) {
  return (
    <div className="w-[185px] px-1 h-[65px] bg-azul rounded-lg grid grid-cols-[max-content_1fr_auto] place-items-center">
      {children}
    </div>
  );
}
