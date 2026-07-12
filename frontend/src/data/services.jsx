import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChartBar,
  HiOutlineHandRaised,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePlayCircle,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

export const services = {
  personal: {
    id: "personal",
    purchaseType: "sessions",
    plans: [
      { id: "8-sessions", sessions: 8, price: 1600 },
      { id: "12-sessions", sessions: 12, price: 2250 },
    ],
    icons: [
      <HiOutlineClipboardDocumentCheck />,
      <HiOutlineAdjustmentsHorizontal />,
      <HiOutlineChartBar />,
      <HiOutlineHandRaised />,
      <HiOutlineChatBubbleLeftRight />,
    ],
  },

  group: {
    id: "group",
    purchaseType: "sessions",
    plans: [
      { id: "8-sessions", sessions: 8, price: 1200 },
      { id: "12-sessions", sessions: 12, price: 1650 },
    ],
  },

  online: {
    id: "online",
    purchaseType: "plan",
    plans: [
      {
        id: "ready",
        nameKey: "serviceDetails.online.plans.ready",
        price: 900,
      },
      {
        id: "personalized",
        nameKey: "serviceDetails.online.plans.personalized",
        price: 1300,
      },
    ],
    icons: [
      <HiOutlineAdjustmentsHorizontal />,
      <HiOutlinePlayCircle />,
      <HiOutlineCalendarDays />,
      <HiOutlineChartBar />,
      <HiOutlineChatBubbleLeftRight />,
    ],
  },
};
