const getColorBackground = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-cyan-900"; // สีเขียว
    case "AVAILABLE":
      return "bg-green-500 hover:bg-green-400"; // สีเขียว
    case "BORROWED":
      return "bg-blue-500 hover:bg-blue-400"; // สีแดง
    case "WAITAPPROVAL":
      return "bg-indigo-500 hover:bg-indigo-400"; // สีเหลือง
    default:
      return "bg-gray-500 hover:bg-gray-400"; // สีเทาเป็นค่าเริ่มต้น
  }
};

export { getColorBackground };
