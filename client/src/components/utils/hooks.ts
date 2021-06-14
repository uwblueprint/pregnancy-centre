import React, { useEffect, useRef, useState } from "react";

// Source: https://stackoverflow.com/a/54570068
const useComponentVisible = (
    initialIsVisible: boolean
): {
    ref: React.RefObject<HTMLDivElement>;
    isComponentVisible: boolean;
    setIsComponentVisible: (isVisible: boolean) => void;
} => {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef<HTMLDivElement>(null);

    const handleHideDropdown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsComponentVisible(false);
        }
    };

    const handleClickOutside = (event: Event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsComponentVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleHideDropdown, true);
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("keydown", handleHideDropdown, true);
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    return { ref, isComponentVisible, setIsComponentVisible };
};

export { useComponentVisible };
