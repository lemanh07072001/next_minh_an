export default function Loading() {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="h-4 w-4 rounded-full animate-spin border-2 border-gray-500 border-t-transparent" />
      <span className="text-gray-600 text-sm">Đang tải dữ liệu...</span>
    </div>
  );
}
