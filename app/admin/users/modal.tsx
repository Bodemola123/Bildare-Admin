// components/ui/modal.tsx
"use client";

import { Button } from "@/components/ui/button";
import React from "react";


interface ModalProps {
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function Modal({ title, description, onClose, onConfirm }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
