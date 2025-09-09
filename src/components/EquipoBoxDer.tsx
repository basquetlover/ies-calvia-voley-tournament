import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function EquipoBoxDer({ children }: Props) {
  return (
    <div className="w-[185px] pl-2 h-[60px] bg-azul rounded-lg grid grid-cols-[max-content_1fr_45px] place-items-center">
      {children}
    </div>
  );
}
