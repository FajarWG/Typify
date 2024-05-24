import React from "react";
import {Modal, ModalContent, ModalBody, Button} from "@nextui-org/react";

export default function ModalStart({hook, start}: any) {

  const {isOpen, onOpen, onClose} = hook;

  

  return (
    <>
      <Modal 
        size={"sm"} 
        isOpen={isOpen} 
        onClose={onClose} 
        hideCloseButton	
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-10">
                <h1 className="
                  text-3xl
                  font-bold
                  text-center
                  text-gray-700
                  mb-4
                ">Sudah Siap?</h1>
                <Button color="primary"  onPress={() => {onClose(); start();}}>
                  Mulai Belajar
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tidak Jadi
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
