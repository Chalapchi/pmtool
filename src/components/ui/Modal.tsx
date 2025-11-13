import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={clsx(
          'relative bg-dark-800 rounded-lg shadow-xl',
          'border border-dark-600',
          'flex flex-col',
          'max-h-[90vh]',
          {
            'w-full max-w-md': size === 'sm',
            'w-full max-w-2xl': size === 'md',
            'w-full max-w-4xl': size === 'lg',
            'w-full max-w-6xl': size === 'xl',
          }
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-dark-600">
            <h2 className="text-xl font-semibold text-dark-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-dark-700 transition-colors"
            >
              <X className="w-5 h-5 text-dark-300" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};
