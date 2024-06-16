import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const OrderDetailsModal = ({ isModalOpen, setIsModalOpen, selectedOrderDetails }) => {
  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Order Details
                    </Dialog.Title>
                    <div className="mt-2">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Order ID</th>
                            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Item ID</th>
                            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Product Name</th>
                            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Quantity</th>
                            <th className="py-1 px-2 border-b text-left text-gray-600 font-medium">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrderDetails.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="py-1 px-2 border-b">{item.orderId}</td>
                              <td className="py-1 px-2 border-b">{item.id}</td>
                              <td className="py-1 px-2 border-b">{item.name}</td>
                              <td className="py-1 px-2 border-b">{item.quantity}</td>
                              <td className="py-1 px-2 border-b">{item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default OrderDetailsModal;
