import moment from "moment";

const timeTH = (time: string): string => {
  return moment(time).format("LLLL");
};

export { timeTH };
