import { useEffect, RefObject } from 'react';

export const useScrollOnUpdate = (
    ref: RefObject<HTMLElement | null>,
    dependencies: any[]
) => {
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, dependencies);
};
