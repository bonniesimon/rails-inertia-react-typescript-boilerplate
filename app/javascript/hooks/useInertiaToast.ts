import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toaster } from "@/components/ui/toaster";

export function useInertiaToasts() {
  const { flash } = usePage<InertiaSharedProps>().props;

  useEffect(() => {
    if (flash?.notice) {
      toaster.create({ title: flash.notice, type: "success" });
    }
    if (flash?.alert) {
      toaster.create({ title: flash.alert, type: "error" });
    }
  }, [flash?.notice, flash?.alert]);
}
