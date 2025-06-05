const getColorBackground = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-cyan-900"; // สีเขียว
    case "AVAILABLE":
      return "bg-green-500 hover:bg-green-400"; // สีเขียว
    case "BORROWED":
      return "bg-red-500 hover:bg-red-400"; // สีแดง
    case "APPROVED":
      return "bg-green-500 hover:bg-green-400"; // สีเขียว
    case "WAITAPPROVAL":
      return "bg-indigo-500 hover:bg-indigo-400"; // สีเหลือง
    default:
      return "bg-gray-500 hover:bg-gray-400"; // สีเทาเป็นค่าเริ่มต้น
  }
};

const translateStatus = (status: string): string => {
  const statusTranslations: { [key: string]: string } = {
    PENDING: "รอดำเนินการ",
    WAITAPPROVAL: "รอการอนุมัติ",
    APPROVED: "อนุมัติ",
    REJECTED: "ถูกปฏิเสธ",
    AVAILABLE: "พร้อมใช้งาน",
    BORROWED: "ถูกยืม",
    MAINTENANCE: "กำลังซ่อมบำรุง",
  };

  return statusTranslations[status] || "สถานะไม่รู้จัก";
};

const translateStatusLogs = (status: string): string => {
  const statusTranslations: { [key: string]: string } = {
    WAITAPPROVAL_BORROW: "รอการอนุมัติยืม",
    WAITAPPROVAL_RETURN: "รอการอนุมัติคืน",
    APPROVED_RETURN: "อนุมัติคืน",
    APPROVED_BORROW: "อนุมัติยืม",
  };

  return statusTranslations[status] || "สถานะไม่รู้จัก";
};

export { getColorBackground, translateStatus, translateStatusLogs };
