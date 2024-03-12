import React from "react";
import Image from "next/image";
import { MsgType } from "./index";
interface AvatarProps {
  role: MsgType;
}

export default function Index(props: AvatarProps) {
  const { role } = props;
  return (
    <div className=" h-12 w-12 flex-none">
      {role === "system" ? (
        <Image src="/icons/robot-avatar.png" alt="" width={24} height={24} />
      ) : (
        <Image src="/icons/user-avatar.png" alt=""  width={24} height={24} />
      )}
    </div>
  );
}
