"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <h2 className="text-xl font-semibold text-red-500">
        Có lỗi xảy ra 😥
      </h2>

      <p className="text-gray-500 mt-2">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
      >
        Thử lại
      </button>
    </div>
  );
}
