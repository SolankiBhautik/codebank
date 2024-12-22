import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';



interface CategoryTagSelectorProps {
    value: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
}

export const CategoryTagSelector: React.FC<CategoryTagSelectorProps> = ({
    value,
    onChange,
    placeholder = "Add items"
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newItem = inputValue.trim();
            if (newItem && !value.includes(newItem)) {
                onChange([...value, newItem]);
                setInputValue('');
            }
        }
    };

    const removeItem = (itemToRemove: string) => {
        onChange(value.filter(item => item !== itemToRemove));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((item) => (
                    <Badge
                        key={item}
                        variant="secondary"
                        className="flex items-center"
                    >
                        {item}
                        <X
                            className="ml-2 h-4 w-4 cursor-pointer"
                            onClick={() => removeItem(item)}
                        />
                    </Badge>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
        </div>
    );
};