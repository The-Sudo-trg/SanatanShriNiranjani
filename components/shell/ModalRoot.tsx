"use client";

import { useModalStore } from "@/stores/modals";
import type { SaintRow, TempleRow } from "@/lib/content";
import {
  GadiPujaModal,
  NamkaranModal,
  SantBookingModal,
  VolunteerModal,
} from "./modals/BookingModals";
import {
  GoldenBabaModal,
  LiveDarshanModal,
  LiveGauModal,
  NearbyModal,
  NotificationModal,
  SouthSaintsModal,
} from "./modals/InfoModals";
import { AiChatModal } from "./modals/AiChatModal";
import { AkharaDirectoryModal } from "./modals/AkharaDirectoryModal";

// NAVIGATION §7.1 — one modal at a time is enforced by the store; Kumbh 2027 is a page (§4)
export default function ModalRoot({
  temples,
  saints,
}: {
  temples: TempleRow[];
  saints: SaintRow[];
}) {
  const active = useModalStore((s) => s.active);
  void active; // store subscription re-renders the tree below
  return (
    <>
      <NearbyModal temples={temples} />
      <GadiPujaModal />
      <NamkaranModal />
      <SantBookingModal />
      <VolunteerModal />
      <LiveDarshanModal />
      <LiveGauModal />
      <NotificationModal />
      <SouthSaintsModal saints={saints} />
      <GoldenBabaModal saints={saints} />
      <AiChatModal />
      <AkharaDirectoryModal saints={saints} />
    </>
  );
}
