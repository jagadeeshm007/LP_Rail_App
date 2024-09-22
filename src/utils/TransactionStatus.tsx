import {status,statusColors} from "@/assets/Types";

const getStatusColor = (Status: string) => {
  switch (Status) {
    case status.inital:
      return statusColors.initial;
    case status.phase1:
      return statusColors.phase1;
    case status.phase2:
      return statusColors.phase2;
    case status.phase3:
      return statusColors.phase3;
    case status.phase4:
      return statusColors.phase4;
    case status.final:
      return statusColors.final;
    default:
      return "#D32F2F";
  }
};

export { getStatusColor };
