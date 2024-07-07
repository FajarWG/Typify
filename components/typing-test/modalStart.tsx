import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ModalDone({ hook, data }: any) {
  const { isOpen, onOpen, onClose } = hook;

  return (
    <>
      <Modal size={"sm"} isOpen={isOpen} onClose={onClose} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-10 text-black">
                <h1 className="text-3xl font-bold text-center mb-4">
                  Tes Selesai
                </h1>
                <div className="flex flex-row gap-4">
                  <div
                    className={`flex flex-row p-2 rounded-md  gap-2 items-center text-center `}
                  >
                    <div>
                      <span className="font-bold">KPM </span>
                      <span>{data.wpm}</span>
                    </div>

                    <div>
                      <span className="font-bold">Akurasi </span>
                      <span>{data.accuracy}%</span>
                    </div>

                    <div>
                      <span className="font-bold">Benar </span>
                      <span>{data.correct}</span>
                    </div>

                    <div>
                      <span className="font-bold">Salah </span>
                      <span>{data.error}</span>
                    </div>
                  </div>
                </div>

                <Button
                  color="primary"
                  onPress={() => {
                    window.location.reload();
                  }}
                >
                  Selesai
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
