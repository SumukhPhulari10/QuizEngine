"use client";

type PopupModalProps = {
  message: string;
  visible: boolean;
  onClose: () => void;
};

export default function PopupModal({ message, visible, onClose }: PopupModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl max-w-sm w-full animate-fadeIn">
        <h2 className="text-xl font-semibold mb-3 text-center">{message}</h2>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
