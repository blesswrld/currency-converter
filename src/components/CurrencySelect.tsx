"use client";

import * as Select from "@radix-ui/react-select";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";
import CurrencyIcon from "./CurrencyIcon";

type Currency = {
    code: string;
    name: string;
};

interface CurrencySelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    currencies: Currency[];
}

const CurrencySelect = ({
    id,
    label,
    value,
    onChange,
    currencies,
}: CurrencySelectProps) => {
    const selectedCurrency = currencies.find((c) => c.code === value);
    const labelId = `${id}-label`;

    return (
        <div>
            <label
                id={labelId}
                className="block text-sm font-medium text-slate-400 mb-1.5"
            >
                {label}
            </label>
            <Select.Root value={value} onValueChange={onChange}>
                <Select.Trigger
                    id={id}
                    aria-labelledby={labelId}
                    className="w-full bg-[#2D3748] border-transparent rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none flex items-center justify-between text-white text-left"
                >
                    <Select.Value asChild>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <CurrencyIcon
                                code={value}
                                className="w-6 h-6 flex-shrink-0 -mb-2"
                            />
                            <span className="truncate">
                                {selectedCurrency
                                    ? `${selectedCurrency.code} - ${selectedCurrency.name}`
                                    : "Выбрать..."}
                            </span>
                        </div>
                    </Select.Value>
                    <Select.Icon className="text-slate-400">
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content
                        position="popper"
                        sideOffset={5}
                        className="bg-[#1E293B] rounded-lg shadow-lg z-50 overflow-hidden w-[var(--radix-select-trigger-width)]"
                    >
                        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] cursor-default text-white">
                            <ChevronUpIcon />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-2 max-h-[256px]">
                            {currencies.map((curr) => (
                                <Select.Item
                                    key={curr.code}
                                    value={curr.code}
                                    className="flex items-center gap-3 p-2 rounded-md text-sm text-white relative select-none data-[highlighted]:bg-cyan-600 data-[highlighted]:outline-none cursor-pointer"
                                >
                                    <CurrencyIcon
                                        code={curr.code}
                                        className="w-6 h-6 flex-shrink-0 -mb-2"
                                    />
                                    <Select.ItemText>
                                        {curr.code} - {curr.name}
                                    </Select.ItemText>
                                    <Select.ItemIndicator className="absolute right-2 inline-flex items-center">
                                        <CheckIcon />
                                    </Select.ItemIndicator>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] cursor-default text-white">
                            <ChevronDownIcon />
                        </Select.ScrollDownButton>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
};

export default CurrencySelect;
