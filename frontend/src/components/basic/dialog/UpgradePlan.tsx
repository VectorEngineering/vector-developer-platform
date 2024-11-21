import { Fragment } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";

import { useOrganization } from "@app/context";

// REFACTOR: Move all these modals into one reusable one
type Props = {
  isOpen?: boolean;
  onClose: () => void;
  text: string;
};

const UpgradePlanModal = ({ isOpen, onClose, text }: Props) => {
  const router = useRouter();
  const { currentOrg } = useOrganization();

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 drop-shadow-xl" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 pt-5 overflow-hidden text-left align-middle transition-all transform border rounded-md shadow-xl border-mineshaft-500 bg-bunker">
                  <Dialog.Title as="h3" className="text-xl font-medium leading-6 text-primary">
                    Unleash Vector&apos;s Full Power
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="mb-1 text-sm text-bunker-300">{text}</p>
                    <p className="text-sm text-bunker-300">
                      Upgrade and get access to this, as well as to other powerful enhancements.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black duration-200 border border-transparent rounded-md hover:text-semibold bg-primary opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => router.push(`/org/${currentOrg?.id}/billing`)}
                    >
                      Upgrade Now
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 ml-2 text-sm font-medium text-gray-400 duration-200 bg-gray-800 border border-transparent rounded-md hover:text-semibold hover:border-red hover:text-red focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={onClose}
                    >
                      Maybe Later
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UpgradePlanModal;
