import { motion } from 'framer-motion';
import React from 'react';
import axios from 'axios';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Suponiendo que obtienes el API_URL_BASE de alguna parte:
import { getParamsEnv } from '../functions/getParamsEnv';
import { useSelector } from 'react-redux';
const { API_URL_BASE } = getParamsEnv();

export default function TutorialCard({
  step = 0,
  totalSteps = 7,
  onNextStep = () => {},
  onCloseTutorial = () => {},
  iconPositions = {},
  tutorialSteps = [],
  isStepReady = true,

} = {}) {
   const token = useSelector((state) => state?.client?.token);
  const { text, icon } = tutorialSteps[step] || {};
  const position = iconPositions[step] || { top: '100px', left: '100px' };

  // 1. Esta función se encarga de llamar a /client/completeTutorial
  //    y luego cerrar el tutorial. 
  const handleCompleteTutorial = async () => {
    try {
      await axios.post(
        `${API_URL_BASE}/api/clients/completeTutorial`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error completing tutorial:', error);
    } finally {
      // Luego de la llamada, cerramos el tutorial.
      onCloseTutorial();
    }
  };

  // 2. Evento al hacer clic en “Don’t show again”
  //    Llamamos directamente a handleCompleteTutorial()
  const handleDontShowAgain = () => {
    handleCompleteTutorial();
  };

  // 3. Evento al hacer clic en el botón “Next” o “Finish”
  //    - Si estamos en el último paso, también completamos el tutorial.
  //    - Si no, solo llamamos onNextStep.
  const handleNextOrFinish = () => {
    if (step + 1 === totalSteps) {
      handleCompleteTutorial();
    } else {
      onNextStep();
    }
  };

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
            {icon && React.cloneElement(icon, { className: 'w-6 h-6 text-amber-600' })}
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
            onClick={handleDontShowAgain}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
          >
            <XMarkIcon className="w-3 h-3 mr-1" />
            Don’t show again
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isStepReady ? handleNextOrFinish : undefined}
            className={`px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-full ${
              isStepReady
                ? 'hover:from-amber-600 hover:to-amber-700'
                : 'opacity-50 cursor-not-allowed'
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
