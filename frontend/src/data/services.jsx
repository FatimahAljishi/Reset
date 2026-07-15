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
  },

  online: {
    id: "online",
    icons: [
      <HiOutlineAdjustmentsHorizontal />,
      <HiOutlinePlayCircle />,
      <HiOutlineCalendarDays />,
      <HiOutlineChartBar />,
      <HiOutlineChatBubbleLeftRight />,
    ],
  },
};
