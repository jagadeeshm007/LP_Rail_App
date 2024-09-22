import { status as Status } from "@/assets/Types";
export const GetMessage = (newstatus: string) => {
    let message = "Change";
    if (newstatus === Status.fail) {
        message = "Deny";
    } else if (newstatus === Status.phase1) {
        message = "Approve";
    } else if (newstatus === Status.inital) {
        message = "edit";
    } else if (newstatus === Status.phase2) {
        message = "upload";
    } else if (newstatus === Status.final) {
        message = "Accept";
    } else if (newstatus === Status.qualityfail) {
        message = "send back";
    } else if (newstatus === Status.Suspend) {
        message = "Suspend";
    } else {
        message = "Change";
    }
    return message;
};