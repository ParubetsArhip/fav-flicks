// import { motion, AnimatePresence } from "framer-motion";
// import React from "react";
//
// interface ModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     title?: string;
//     children?: React.ReactNode;
// }
//
// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
//     if (!isOpen) return null;
//
//     const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
//         if (e.target === e.currentTarget) onClose();
//     };
//
//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
//                     onClick={handleOverlayClick}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                 >
//                     <motion.div
//                         className="bg-gradient-to-bl from-violet-500/20 to-fuchsia-500/20
//               backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6
//               w-[90%] max-w-[500px] text-white relative"
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0.9, opacity: 0 }}
//                         transition={{ type: "spring", stiffness: 200, damping: 20 }}
//                     >
//                         <button
//                             onClick={onClose}
//                             className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
//                         >
//                             ✕
//                         </button>
//
//                         {title && (
//                             <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
//                         )}
//
//                         <div className="overflow-y-auto max-h-[60vh] pr-2">{children}</div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };
//
// export default Modal;








import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gradient-to-bl from-violet-500/20 to-fuchsia-500/20
              backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6
              w-[90%] max-w-[500px] text-white relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
                        >
                            ✕
                        </button>

                        {title && (
                            <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
                        )}

                        {/* 🔥 Стилизованный вертикальный скролл */}
                        <div
                            className="overflow-y-auto max-h-[60vh] pr-2 custom-scroll"
                        >
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
