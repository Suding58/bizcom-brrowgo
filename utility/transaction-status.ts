const getColorBackground = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-cyan-900"; // สีเขียว
    case "APPROVED":
      return "bg-green-500 hover:bg-green-400"; // สีเขียว
    case "REJECTED":
      return "bg-red-500 hover:bg-red-400"; // สีแดง
    case "WAITAPPROVAL":
      return "bg-indigo-500 hover:bg-indigo-400"; // สีเหลือง
    default:
      return "bg-slate-500 hover:bg-slate-400"; // สีเทาเป็นค่าเริ่มต้น
  }
};

export { getColorBackground };
