"use client";
import React, { ChangeEvent } from "react";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
type Props = {
  disabled: boolean;
  language: string;
  onChange: (languageSelected: string) => void;
};

export const data_bahasa = [
  { key: "id", value: "id", label: "Indonesia" },
  { key: "en", value: "en", label: "English" },
  { key: "es", value: "es", label: "Español" },
  { key: "fr", value: "fr", label: "Français" },
];

const LanguageSelector: React.FC<Props> = (props) => (
  <div className="md:flex-initial w-full md:w-1/2 lg:w-1/3 md:ml-3 ml:0">
    <Select
      label="Bahasa"
      placeholder="Pilih Bahasa"
      className="max-w-xs"
      variant="bordered"
      defaultSelectedKeys={["id"]}
      value={props.language}
      color="primary"
      disabled={props.disabled}
      onChange={(event: ChangeEvent<HTMLSelectElement>) =>
        props.onChange(event.target.value)
      }
    >
      {data_bahasa.map((bahasa) => (
        <SelectItem
          key={bahasa.key}
          value={bahasa.value}
          className="text-black"
          startContent={
            <Avatar
              alt="Argentina"
              className="w-6 h-6"
              src={`https://flagcdn.com/${
                bahasa.key === "en" ? "us" : bahasa.key
              }.svg`}
            />
          }
        >
          {bahasa.label}
        </SelectItem>
      ))}
    </Select>
  </div>
);

export default LanguageSelector;
