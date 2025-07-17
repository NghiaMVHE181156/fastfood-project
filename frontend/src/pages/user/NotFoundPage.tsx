import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4 py-12">
      <div className="relative mb-6">
        <span className="absolute -inset-2 blur-xl opacity-40 bg-orange-200 rounded-full animate-pulse" />
        <AlertTriangle className="w-24 h-24 text-orange-500 drop-shadow-lg animate-bounce" />
      </div>
      <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-500 to-orange-400 mb-2 drop-shadow-md select-none">
        404
      </h1>
      <p className="text-2xl font-semibold text-gray-700 mb-2 animate-fade-in">
        Ôi không! Không tìm thấy trang này.
      </p>
      <p className="text-base text-gray-500 mb-8 max-w-md text-center animate-fade-in delay-100">
        Địa chỉ bạn truy cập không tồn tại hoặc đã bị di chuyển. Hãy kiểm tra
        lại đường dẫn hoặc quay về trang chủ để tiếp tục trải nghiệm dịch vụ của
        chúng tôi.
      </p>
      <Button
        asChild
        size="lg"
        className="px-8 py-3 text-lg font-semibold shadow-md animate-fade-in delay-200"
      >
        <Link to="/">Quay về trang chủ</Link>
      </Button>
    </div>
  );
}
