import {
  HiOutlineClipboardDocumentCheck,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineChartBar,
  HiOutlineHandRaised,
  HiOutlineChatBubbleLeftRight,
  HiOutlineVideoCamera,
  HiOutlineUserCircle,
  HiOutlineClipboardDocumentList,
  HiOutlinePlayCircle,
  HiOutlineCalendarDays,
  HiOutlineListBullet,
  HiOutlineKey,
  HiOutlineArrowPath,
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
      <HiOutlineVideoCamera />,
      <HiOutlineUserCircle />,
      <HiOutlineHandRaised />,
      <HiOutlineChartBar />,
      <HiOutlineChatBubbleLeftRight />,
    ],
  },

  "ready-programs": {
    id: "ready-programs",
    icons: [
      <HiOutlineClipboardDocumentList />,
      <HiOutlinePlayCircle />,
      <HiOutlineCalendarDays />,
      <HiOutlineListBullet />,
      <HiOutlineKey />,
    ],
  },

  "personalized-programs": {
    id: "personalized-programs",
    icons: [
      <HiOutlineClipboardDocumentCheck />,
      <HiOutlineAdjustmentsHorizontal />,
      <HiOutlinePlayCircle />,
      <HiOutlineArrowPath />,
      <HiOutlineChatBubbleLeftRight />,
      <HiOutlineCalendarDays />,
    ],
  },
};
