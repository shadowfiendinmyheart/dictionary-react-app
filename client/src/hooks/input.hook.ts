import React, { useState } from 'react';

const useInput = (initialValue: string) => {
    const [value, setValue] = useState<string>(initialValue);

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value)
    }

    return {value, setValue, onChange}
}

export default useInput;
