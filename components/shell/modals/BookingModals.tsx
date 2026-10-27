"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Baby, Car, HandHeart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModalStore } from "@/stores/modals";
import { gadiPujaSchema, namkaranSchema, santBookingSchema, volunteerSchema } from "@/lib/validators";
import { PRICES } from "@/lib/constants";

const gadiFormSchema = gadiPujaSchema.omit({ type: true });
const namkaranFormSchema = namkaranSchema.omit({ type: true });
const santFormSchema = santBookingSchema.omit({ type: true });

type GadiForm = z.infer<typeof gadiFormSchema>;
type NamkaranForm = z.infer<typeof namkaranFormSchema>;
type SantForm = z.infer<typeof santFormSchema>;
type VolunteerForm = z.infer<typeof volunteerSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-[10px] text-red-700">
      {message}
    </p>
  );
}

async function postJson(url: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: data.error ?? "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।" };
  } catch {
    return { ok: false, error: "कुछ त्रुटि हुई, कृपया पुनः प्रयास करें।" };
  }
}

// गाड़ी पूजन बुकिंग (₹501) — F1
export function GadiPujaModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const open = active === "GADI_PUJA";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GadiForm>({ resolver: zodResolver(gadiFormSchema) });

  async function onSubmit(values: GadiForm) {
    const result = await postJson("/api/bookings", { type: "GADI_PUJA", ...values });
    if (result.ok) {
      toast.success("आपका गाड़ी पूजन अनुरोध प्रशासन को भेज दिया गया है। (₹501)");
      reset();
      close();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogTitle className="flex items-center gap-2 text-sm font-bold text-maroonText">
          <Car className="h-4 w-4 text-saffron" aria-hidden />
          वाहन (गाड़ी) पूजन बुकिंग
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="gadi-name">वाहन स्वामी का नाम</Label>
            <Input suppressHydrationWarning id="gadi-name" placeholder="वाहन स्वामी का नाम" {...register("personName")} />
            <FieldError message={errors.personName?.message} />
          </div>
          <div>
            <Label htmlFor="gadi-no">गाड़ी नंबर</Label>
            <Input suppressHydrationWarning id="gadi-no" placeholder="गाड़ी नंबर (जैसे UP-16-XX-0000)" {...register("vehicleNo")} />
            <FieldError message={errors.vehicleNo?.message} />
          </div>
          <div>
            <Label htmlFor="gadi-date">दिनांक</Label>
            <Input suppressHydrationWarning id="gadi-date" type="date" {...register("date")} />
            <FieldError message={errors.date?.message} />
          </div>
          <Button suppressHydrationWarning type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "भेजा जा रहा है…" : `पूजन बुक करें (₹${PRICES.GADI_PUJA})`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// नामकरण संस्कार बुकिंग
export function NamkaranModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const open = active === "NAMKARAN";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NamkaranForm>({ resolver: zodResolver(namkaranFormSchema) });

  async function onSubmit(values: NamkaranForm) {
    const result = await postJson("/api/bookings", { type: "NAMKARAN", ...values });
    if (result.ok) {
      toast.success("नामकरण संस्कार हेतु आपका अनुरोध प्रशासन को भेज दिया गया है।");
      reset();
      close();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogTitle className="flex items-center gap-2 text-sm font-bold text-maroonText">
          <Baby className="h-4 w-4 text-purple-600" aria-hidden />
          नामकरण संस्कार बुकिंग
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="namkaran-name">माता/पिता का नाम</Label>
            <Input suppressHydrationWarning id="namkaran-name" placeholder="माता/पिता का नाम" {...register("personName")} />
            <FieldError message={errors.personName?.message} />
          </div>
          <div>
            <Label htmlFor="namkaran-date">दिनांक</Label>
            <Input suppressHydrationWarning id="namkaran-date" type="date" {...register("date")} />
            <FieldError message={errors.date?.message} />
          </div>
          <Button suppressHydrationWarning type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "भेजा जा रहा है…" : "संस्कार बुकिंग भेजें"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// घर पर संत एवं आचार्य बुकिंग
export function SantBookingModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const open = active === "BOOKING";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SantForm>({ resolver: zodResolver(santFormSchema) });

  async function onSubmit(values: SantForm) {
    const result = await postJson("/api/bookings", { type: "SANT", ...values });
    if (result.ok) {
      toast.success("संत बुकिंग हेतु आपका अनुरोध प्रशासन को भेज दिया गया है।");
      reset();
      close();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogTitle className="text-sm font-bold text-maroonText">
          घर पर संत एवं आचार्य बुकिंग
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="sant-name">आपका नाम</Label>
            <Input suppressHydrationWarning id="sant-name" placeholder="आपका नाम" {...register("personName")} />
            <FieldError message={errors.personName?.message} />
          </div>
          <div>
            <Label htmlFor="sant-phone">मोबाइल नंबर</Label>
            <Input suppressHydrationWarning id="sant-phone" type="tel" inputMode="numeric" placeholder="10 अंकों का मोबाइल नंबर" {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>
          <div>
            <Label htmlFor="sant-date">दिनांक</Label>
            <Input suppressHydrationWarning id="sant-date" type="date" {...register("date")} />
            <FieldError message={errors.date?.message} />
          </div>
          <Button suppressHydrationWarning type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "भेजा जा रहा है…" : "बुकिंग अनुरोध भेजें"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// निरंजनी युवा सेवा दल — F8
export function VolunteerModal() {
  const active = useModalStore((s) => s.active);
  const close = useModalStore((s) => s.close);
  const open = active === "VOLUNTEER";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerForm>({ resolver: zodResolver(volunteerSchema) });

  async function onSubmit(values: VolunteerForm) {
    const result = await postJson("/api/volunteers", values);
    if (result.ok) {
      toast.success("सेवा दल पास जारी करने की प्रक्रिया प्रारंभ हो गई है। धन्यवाद!");
      reset();
      close();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogTitle className="flex items-center gap-2 text-sm font-bold text-maroonText">
          <HandHeart className="h-4 w-4 text-indigo-600" aria-hidden />
          निरंजनी युवा सेवा दल (Volunteer)
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="vol-name">आपका पूरा नाम</Label>
            <Input suppressHydrationWarning id="vol-name" placeholder="आपका पूरा नाम" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <Label htmlFor="vol-wa">मोबाइल नंबर (WhatsApp)</Label>
            <Input suppressHydrationWarning id="vol-wa" type="tel" inputMode="numeric" placeholder="10 अंकों का WhatsApp नंबर" {...register("whatsapp")} />
            <FieldError message={errors.whatsapp?.message} />
          </div>
          <Button suppressHydrationWarning type="submit" variant="indigo" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "भेजा जा रहा है…" : "सेवा दल पास प्राप्त करें"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
