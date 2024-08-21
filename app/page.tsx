"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Page() {
  const router = useRouter();
  const [isCancelled, setIsCancelled] = useState(false);
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (!isCancelled && count === 0) {
      router.push("https://6lueparr0t.github.io");
    }
  }, [isCancelled, count]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    if(isCancelled) clearInterval(timer);

    return () => clearInterval(timer);
  }, [isCancelled]);

  const handleCancel = () => {
    setIsCancelled(true);
  };

  return (
    <div className={"m-4"}>
      {isCancelled === false && (
        <div className={"text-2xl"}>
          {count}초 뒤, 6lueparr0t.github.io 로 이동합니다.
          <br />
          <Button className="my-4" onClick={handleCancel}>
            취소
          </Button>
        </div>
      )}
      {isCancelled === true && (
        <div className={"text-2xl"}>
          취소되었습니다.
          <br />
          <Button className="my-4" onClick={()=>router.push("https://6lueparr0t.github.io")}>
            이동
          </Button>
        </div>
      )}
    </div>
  );
}

export default Page;
