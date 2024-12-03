import { motion } from 'framer-motion'; // Importar motion desde framer-motion
import React from 'react';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/solid'; // Importación de iconos desde Heroicons

export default function TutorialCard({
  step = 0,
  totalSteps = 7,
  onNextStep = () => {},
  onCloseTutorial = () => {},
  iconPositions = {},
  tutorialSteps = [],
  isStepReady = true,  // nuevo prop
} = {}) {
  const { text, icon } = tutorialSteps[step] || {};
  const position = iconPositions[step] || { top: '100px', left: '100px' };

  return (
    <motion.div
      className="fixed z-50"
      style={{ top: position.top, left: position.left }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="w-80 sm:w-96 overflow-hidden rounded-2xl bg-white shadow-lg p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            {React.cloneElement(icon, { className: 'w-6 h-6 text-amber-600' })}
          </div>
          <div className="flex-grow">
            <p className="text-sm leading-relaxed text-gray-700 mb-2">{text}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>Step {step + 1}</span>
              <span className="mx-2">•</span>
              <span>{totalSteps} steps in total</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            onClick={onCloseTutorial}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
          >
            <XMarkIcon className="w-3 h-3 mr-1" />
            Don't show again
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isStepReady ? onNextStep : undefined}
            className={`px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-full ${
              isStepReady ? 'hover:from-amber-600 hover:to-amber-700' : 'opacity-50 cursor-not-allowed'
            } transition-all duration-200 flex items-center`}
          >
            {step + 1 === totalSteps ? 'Finish' : 'Next'}
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
