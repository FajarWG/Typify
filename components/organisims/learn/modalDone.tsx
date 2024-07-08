import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ModalDone({ hook, dataGame }: any) {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = hook;

  return (
    <>
      <Modal size={"md"} isOpen={isOpen} onClose={onClose} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-10">
                <h1
                  className="
                  text-xl
                  font-bold
                  text-center
                  text-gray-700
                  mb-4
                "
                >
                  Kamu sudah menyelesaikan semua kata! Selamat! 🎉
                </h1>

                <div
                  className={`flex flex-row p-2 rounded-md gap-16 items-center text-center text-black justify-center`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">Akurasi </span>
                    <span>{dataGame.dataGame.accuracy}%</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold">Kesalahan </span>
                    <span>{dataGame.dataGame.error}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold">Waktu </span>
                    <span>{dataGame.dataGame.time} detik</span>
                  </div>
                </div>

                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    router.push("/belajar");
                  }}
                >
                  Kembali ke halaman belajar
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
