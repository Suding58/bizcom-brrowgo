const getColorBackground = (status: string): string => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-500 hover:bg-green-400"; // สีเขียว
    case "BORROWED":
      return "bg-red-500 hover:bg-red-400"; // สีแดง
    case "MAINTENANCE":
      return "bg-yellow-500 hover:bg-yellow-400"; // สีเหลือง
    case "WAITAPPROVAL":
      return "bg-indigo-500 hover:bg-indigo-400"; // สีเหลือง
    default:
      return "bg-gray-500 hover:bg-gray-400"; // สีเทาเป็นค่าเริ่มต้น
  }
};

export { getColorBackground };
